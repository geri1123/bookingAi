import { SubscriptionEntity } from "../entities/subscription.entity";
import { PlanEntity } from "../entities/plan.entity";
import { UsageCounterEntity } from "../entities/usage-counter.entity";

export type AiAccessReason = "OK" | "NO_SUBSCRIPTION" | "EXPIRED" | "MESSAGE_LIMIT_REACHED";

export interface AiAccessResult {
  allowed: boolean;
  reason: AiAccessReason;
  messageCount: number;
  messageLimit: number | null;
  autoRenew: boolean | null;
  currentPeriodEnd: Date | null;
  planTier: string | null;
  planName: string | null;
}

export class SubscriptionAccessPolicy {
  static evaluate(
    subscription: SubscriptionEntity | null,
    plan: PlanEntity | null,
    usage: UsageCounterEntity | null,
    now: Date = new Date(),
  ): AiAccessResult {
    if (!subscription) {
      return {
        allowed: false,
        reason: "NO_SUBSCRIPTION",
        messageCount: 0,
        messageLimit: null,
        autoRenew: null,
        currentPeriodEnd: null,
        planTier: null,
        planName: null,
      };
    }

    const limit = plan?.messageLimit ?? null;
    const autoRenew = subscription.autoRenew;
    const currentPeriodEnd = subscription.currentPeriodEnd;
    const planTier = plan?.tier ?? null;
    const planName = plan?.name ?? null;

    if (!subscription.isCurrentlyValid(now)) {
      return {
        allowed: false,
        reason: "EXPIRED",
        messageCount: usage?.messageCount ?? 0,
        messageLimit: limit,
        autoRenew,
        currentPeriodEnd,
        planTier,
        planName,
      };
    }

    const messageCount = usage?.messageCount ?? 0;

    if (limit !== null && messageCount >= limit) {
      return {
        allowed: false,
        reason: "MESSAGE_LIMIT_REACHED",
        messageCount,
        messageLimit: limit,
        autoRenew,
        currentPeriodEnd,
        planTier,
        planName,
      };
    }

    return {
      allowed: true,
      reason: "OK",
      messageCount,
      messageLimit: limit,
      autoRenew,
      currentPeriodEnd,
      planTier,
      planName,
    };
  }
}