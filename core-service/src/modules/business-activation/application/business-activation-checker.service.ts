import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { BusinessFindRepository } from "../../business/domain/repositories/business-find.repository";
import { BusinessUpdateRepository } from "../../business/domain/repositories/business-update.repositoy";
import { BusinessMemberFindRepository } from "../../business/domain/repositories/business-member-find.repository";
import { BusinessStatus } from "../../business/domain/entities/business.entity";
import { ServiceFindRepository } from "../../services/domain/repositories/service-find.repository";
import { EmployeeFindRepository } from "../../employees/domain/repositories/employee-find.repository";
import { ScheduleFindRepository } from "../../schedules/domain/repositories/schedule-find.repository";
import { UserFindRepository } from "../../users/domain/repositories/user-find.repository";
import { OutboxEventWriter } from "../../../common/events/outbox-event-writer";
import { EventName } from "../../../common/events/event-name.enum";
import { ACTIVATION_REQUIREMENTS } from "../domain/business-activation-requirements";

@Injectable()
export class BusinessActivationChecker {
  private readonly logger = new Logger(BusinessActivationChecker.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly businessUpdateRepo: BusinessUpdateRepository,
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async checkAndActivate(businessId: string): Promise<void> {
    const business = await this.businessFindRepo.findById(businessId);
    if (!business || business.status !== BusinessStatus.PENDING_SETUP) {
      return;
    }

    const req = ACTIVATION_REQUIREMENTS[business.type];

    const [serviceCount, employeeCount, scheduleCount] = await Promise.all([
      req.needsService ? this.serviceFindRepo.countByBusiness(businessId) : Promise.resolve(1),
      req.needsEmployee ? this.employeeFindRepo.countByBusiness(businessId) : Promise.resolve(1),
      req.needsEmployee ? this.scheduleFindRepo.countByBusiness(businessId) : Promise.resolve(1),
    ]);

    const isComplete = serviceCount > 0 && employeeCount > 0 && scheduleCount > 0;
    if (!isComplete) {
      return;
    }

    const owner = await this.businessMemberFindRepo.findOwner(businessId);
    const ownerUser = owner ? await this.userFindRepo.findById(owner.userId) : null;

    business.activate();

    try {
      await this.prisma.$transaction(async (tx) => {
        await this.businessUpdateRepo.update(business, tx);

        if (ownerUser) {
          await this.outboxWriter.write(
            EventName.BUSINESS_ACTIVATED,
            business.id,
            {
              businessId: business.id,
              businessName: business.name,
              ownerEmail: ownerUser.email,
              ownerFirstName: ownerUser.firstName,
            },
            tx,
          );
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to activate business ${businessId}: ${message}`);
    }
  }
}
