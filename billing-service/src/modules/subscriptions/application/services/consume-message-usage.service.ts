// billing-service/src/modules/subscriptions/application/services/consume-message-usage.service.ts
import { Injectable } from "@nestjs/common";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { UsageCounterRepository } from "../../domain/repositories/usage-counter.repository";
import { AiAccessReason } from "../../domain/services/subscription-access-policy";
import { SubscriptionNotificationService } from "./subscription-notification.service";

export interface ConsumeMessageResult {
  allowed: boolean;
  reason: AiAccessReason;
  messageCount: number;
  messageLimit: number | null;
}

@Injectable()
export class ConsumeMessageUsageService {
  constructor(
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly planFindRepo: PlanFindRepository,
    private readonly usageCounterRepo: UsageCounterRepository,
    private readonly subscriptionNotification: SubscriptionNotificationService,
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
      await this.subscriptionNotification.notifyExpiredOnce(businessId);
      return { allowed: false, reason: "EXPIRED", messageCount: usage?.messageCount ?? 0, messageLimit: limit };
    }

    const result = await this.usageCounterRepo.incrementIfAllowed({
      businessId,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      messageLimit: limit,
    });

    if (!result.allowed) {
      await this.subscriptionNotification.notifyLimitReachedOnce(
        businessId,
        subscription.currentPeriodStart,
        result.messageCount,
        limit,
      );
    }

    return {
      allowed: result.allowed,
      reason: result.allowed ? "OK" : "MESSAGE_LIMIT_REACHED",
      messageCount: result.messageCount,
      messageLimit: limit,
    };
  }
}