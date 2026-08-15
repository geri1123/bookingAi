import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { UsageCounterRepository } from "../../domain/repositories/usage-counter.repository";
import { AiAccessReason } from "../../domain/services/subscription-access-policy";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";
import { CoreServiceClient } from "../../infrastructure/kafka/http/core-service.client";

export interface ConsumeMessageResult {
  allowed: boolean;
  reason: AiAccessReason;
  messageCount: number;
  messageLimit: number | null;
}

@Injectable()
export class ConsumeMessageUsageService {
  private readonly logger = new Logger(ConsumeMessageUsageService.name);

  constructor(
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly planFindRepo: PlanFindRepository,
    private readonly usageCounterRepo: UsageCounterRepository,
    private readonly outboxWriter: OutboxEventWriter,
    private readonly coreServiceClient: CoreServiceClient,
  ) {}

  async consume(businessId: string): Promise<ConsumeMessageResult> {
    const subscription = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (!subscription) {
      return { allowed: false, reason: "NO_SUBSCRIPTION", messageCount: 0, messageLimit: null };
    }

    const plan = await this.planFindRepo.findById(subscription.planId);
    const limit = plan?.messageLimit ?? null;

    if (!subscription.isCurrentlyValid()) {
      const usage = await this.usageCounterRepo.findByBusinessAndPeriod(businessId, subscription.currentPeriodStart);
      return { allowed: false, reason: "EXPIRED", messageCount: usage?.messageCount ?? 0, messageLimit: limit };
    }

    const result = await this.usageCounterRepo.incrementIfAllowed({
      businessId,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      messageLimit: limit,
    });

    if (!result.allowed) {
      await this.notifyLimitReachedOnce(businessId, subscription.currentPeriodStart, result.messageCount, limit);
    }

    return {
      allowed: result.allowed,
      reason: result.allowed ? "OK" : "MESSAGE_LIMIT_REACHED",
      messageCount: result.messageCount,
      messageLimit: limit,
    };
  }

  
  private async notifyLimitReachedOnce(
    businessId: string,
    periodStart: Date,
    messageCount: number,
    messageLimit: number | null,
  ): Promise<void> {
    const isFirstTime = await this.usageCounterRepo.markLimitNotifiedIfFirstTime(businessId, periodStart);
    if (!isFirstTime) return;

    try {
      const contact = await this.coreServiceClient.getBusinessContact(businessId);
      await this.outboxWriter.write(EventName.SUBSCRIPTION_MESSAGE_LIMIT_REACHED, businessId, {
        businessId,
        businessName: contact?.businessName ?? null,
        ownerEmail: contact?.ownerEmail ?? null,
        ownerFirstName: contact?.ownerFirstName ?? null,
        messageCount,
        messageLimit,
      });
    } catch (err) {
      this.logger.error(
        `S'u dot te publikohet SUBSCRIPTION_MESSAGE_LIMIT_REACHED per ${businessId}: ${
          err instanceof Error ? err.message : err
        }`,
      );
    }
  }
}