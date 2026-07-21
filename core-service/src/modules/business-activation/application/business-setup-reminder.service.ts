import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { BusinessFindRepository } from "../../business/domain/repositories/business-find.repository";
import { BusinessMemberFindRepository } from "../../business/domain/repositories/business-member-find.repository";
import { UserFindRepository } from "../../users/domain/repositories/user-find.repository";
import { ServiceFindRepository } from "../../services/domain/repositories/service-find.repository";
import { EmployeeFindRepository } from "../../employees/domain/repositories/employee-find.repository";
import { ScheduleFindRepository } from "../../schedules/domain/repositories/schedule-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../domain/business-activation-requirements";
import { OutboxEventWriter } from "../../../common/events/outbox-event-writer";
import { EventName } from "../../../common/events/event-name.enum";

const REMINDER_AFTER_DAYS = 3;
// const REMINDER_AFTER_DAYS=1;
@Injectable()
export class BusinessSetupReminderService {
  private readonly logger = new Logger(BusinessSetupReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  //  @Cron(CronExpression.EVERY_10_SECONDS)
  async remindIncompleteBusinesses(): Promise<void> {
    const cutoff = new Date(Date.now() - REMINDER_AFTER_DAYS * 24 * 60 * 60 * 1000);
    const staleBusinesses = await this.businessFindRepo.findStalePendingSetup(cutoff);

    for (const business of staleBusinesses) {
      try {
        const owner = await this.businessMemberFindRepo.findOwner(business.id);
        const ownerUser = owner ? await this.userFindRepo.findById(owner.userId) : null;
        if (!ownerUser) continue;

        const req = ACTIVATION_REQUIREMENTS[business.type];

        const [serviceCount, employeeCount, scheduleCount] = await Promise.all([
          req.needsService ? this.serviceFindRepo.countByBusiness(business.id) : Promise.resolve(1),
          req.needsEmployee ? this.employeeFindRepo.countByBusiness(business.id) : Promise.resolve(1),
          req.needsEmployee ? this.scheduleFindRepo.countByBusiness(business.id) : Promise.resolve(1),
        ]);

        const missingSteps: string[] = [];
        if (req.needsService && serviceCount === 0) missingSteps.push("SERVICE");
        if (req.needsEmployee && employeeCount === 0) missingSteps.push("EMPLOYEE");
        if (req.needsEmployee && scheduleCount === 0) missingSteps.push("SCHEDULE");

        if (missingSteps.length === 0) continue; 

        await this.prisma.$transaction(async (tx) => {
          await this.outboxWriter.write(
            EventName.BUSINESS_SETUP_REMINDER,
            business.id,
            {
              businessId: business.id,
              businessName: business.name,
              ownerEmail: ownerUser.email,
              ownerFirstName: ownerUser.firstName,
              missingSteps,
            },
            tx,
          );

          await tx.business.update({
            where: { id: business.id },
            data: { setupReminderSentAt: new Date() },
          });
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed reminder for business ${business.id}: ${message}`);
      }
    }
  }
}
