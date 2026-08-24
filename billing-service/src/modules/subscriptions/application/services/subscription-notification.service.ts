import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { UsageCounterRepository } from "../../domain/repositories/usage-counter.repository";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";
import { CoreServiceClient } from "../../infrastructure/http/core-service.client";

@Injectable()
export class SubscriptionNotificationService {
  private readonly logger = new Logger(SubscriptionNotificationService.name);

  constructor(
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
    private readonly usageCounterRepo: UsageCounterRepository,
    private readonly outboxWriter: OutboxEventWriter,
    private readonly coreServiceClient: CoreServiceClient,
  ) {}

  async notifyLimitReachedOnce(businessId: string, periodStart: Date, messageCount: number, messageLimit: number | null) {
    const isFirstTime = await this.usageCounterRepo.markLimitNotifiedIfFirstTime(businessId, periodStart);
    if (!isFirstTime) return;
    const contact = await this.coreServiceClient.getBusinessContact(businessId);
    await this.outboxWriter.write(EventName.SUBSCRIPTION_MESSAGE_LIMIT_REACHED, businessId, {
      businessId, businessName: contact?.businessName ?? null,
      ownerEmail: contact?.ownerEmail ?? null, ownerFirstName: contact?.ownerFirstName ?? null,
      messageCount, messageLimit,
    });
  }

  async notifyExpiredOnce(businessId: string) {
    const isFirstTime = await this.subscriptionWriteRepo.markExpiredNotifiedIfFirstTime(businessId);
    if (!isFirstTime) return;
    const contact = await this.coreServiceClient.getBusinessContact(businessId);
    await this.outboxWriter.write(EventName.SUBSCRIPTION_EXPIRED, businessId, {
      businessId, businessName: contact?.businessName ?? null,
      ownerEmail: contact?.ownerEmail ?? null, ownerFirstName: contact?.ownerFirstName ?? null,
    });
  }
    async notifySubscriptionCreated(businessId: string, planName: string, messageLimit: number | null) {
    const contact = await this.coreServiceClient.getBusinessContact(businessId);
    await this.outboxWriter.write(EventName.SUBSCRIPTION_CREATED, businessId, {
      businessId, businessName: contact?.businessName ?? null,
      ownerEmail: contact?.ownerEmail ?? null, ownerFirstName: contact?.ownerFirstName ?? null,
      planName, messageLimit,
    });
  }

  // Thirret nga SubscriptionExpiryCheckerService kur nje biznes qe kishte
  // anuluar (autoRenew=false) bie automatikisht ne planin FREE. Perpara ketij
  // rregullimi, ky rast s'dergonte asnje email/event - biznesi thjesht humbiste
  // akses pa u njoftuar pse.
  async notifyDowngradedToFree(businessId: string) {
    const contact = await this.coreServiceClient.getBusinessContact(businessId);
    await this.outboxWriter.write(EventName.SUBSCRIPTION_CANCELED, businessId, {
      businessId, businessName: contact?.businessName ?? null,
      ownerEmail: contact?.ownerEmail ?? null, ownerFirstName: contact?.ownerFirstName ?? null,
    });
  }
}