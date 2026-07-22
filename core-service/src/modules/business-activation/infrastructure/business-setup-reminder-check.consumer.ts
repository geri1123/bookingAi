import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../../infrastructure/prisma/prisma.service";
import { KafkaConsumerService } from "../../../infrastructure/kafka/kafka-consumer.service";
import { EventName } from "../../../common/events/event-name.enum";
import { OutboxEventWriter } from "../../../common/events/outbox-event-writer";

import { BusinessFindRepository } from "../../business/domain/repositories/business-find.repository";
import { BusinessMemberFindRepository } from "../../business/domain/repositories/business-member-find.repository";
import { UserFindRepository } from "../../users/domain/repositories/user-find.repository";
import { ServiceFindRepository } from "../../services/domain/repositories/service-find.repository";
import { EmployeeFindRepository } from "../../employees/domain/repositories/employee-find.repository";
import { ScheduleFindRepository } from "../../schedules/domain/repositories/schedule-find.repository";
import { ResourceFindRepository } from "../../resources/domain/repositories/resource-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../domain/business-activation-requirements";

interface ReminderCheckPayload {
  businessId: string;
}

@Injectable()
export class BusinessSetupReminderCheckConsumer implements OnModuleInit {
  private readonly logger = new Logger(BusinessSetupReminderCheckConsumer.name);

  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly prisma: PrismaService,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe([EventName.BUSINESS_SETUP_REMINDER_CHECK], async ({ message }) => {
      if (!message.value) return;

      try {
        const payload = JSON.parse(message.value.toString()) as ReminderCheckPayload;
        await this.checkAndDispatchReminder(payload.businessId);
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : String(err);
        this.logger.error(`Failed to process reminder-check: ${errMessage}`);
      }
    });
  }

  private async checkAndDispatchReminder(businessId: string): Promise<void> {
    const business = await this.businessFindRepo.findById(businessId);
    if (!business || business.status !== "PENDING_SETUP") return;

    const owner = await this.businessMemberFindRepo.findOwner(business.id);
    const ownerUser = owner ? await this.userFindRepo.findById(owner.userId) : null;
    if (!ownerUser) return;

    const req = ACTIVATION_REQUIREMENTS[business.type];

    const [serviceCount, employeeCount, scheduleCount, resourceCount] = await Promise.all([
      req.needsService ? this.serviceFindRepo.countByBusiness(business.id) : Promise.resolve(1),
      req.needsEmployee ? this.employeeFindRepo.countByBusiness(business.id) : Promise.resolve(1),
      req.needsEmployee ? this.scheduleFindRepo.countByBusiness(business.id) : Promise.resolve(1),
      req.needsResource ? this.resourceFindRepo.countByBusiness(business.id) : Promise.resolve(1),
    ]);

    const missingSteps: string[] = [];
    if (req.needsService && serviceCount === 0) missingSteps.push("SERVICE");
    if (req.needsEmployee && employeeCount === 0) missingSteps.push("EMPLOYEE");
    if (req.needsEmployee && scheduleCount === 0) missingSteps.push("SCHEDULE");
    if (req.needsResource && resourceCount === 0) missingSteps.push("RESOURCE");

    if (missingSteps.length === 0) return;

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
  }
}