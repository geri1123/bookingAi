import { SubscriptionEntity } from "../entities/subscription.entity";
import { PlanEntity } from "../entities/plan.entity";
import { UsageCounterEntity } from "../entities/usage-counter.entity";

export type AiAccessReason = "OK" | "NO_SUBSCRIPTION" | "EXPIRED" | "MESSAGE_LIMIT_REACHED";

export interface AiAccessResult {
  allowed: boolean;
  reason: AiAccessReason;
  messageCount: number;
  messageLimit: number | null;
}


export class SubscriptionAccessPolicy {
  static evaluate(
    subscription: SubscriptionEntity | null,
    plan: PlanEntity | null,
    usage: UsageCounterEntity | null,
    now: Date = new Date(),
  ): AiAccessResult {
    if (!subscription) {
      return { allowed: false, reason: "NO_SUBSCRIPTION", messageCount: 0, messageLimit: null };
    }

    const limit = plan?.messageLimit ?? null;

    if (!subscription.isCurrentlyValid(now)) {
      return { allowed: false, reason: "EXPIRED", messageCount: usage?.messageCount ?? 0, messageLimit: limit };
    }

    const messageCount = usage?.messageCount ?? 0;

    if (limit !== null && messageCount >= limit) {
      return { allowed: false, reason: "MESSAGE_LIMIT_REACHED", messageCount, messageLimit: limit };
    }

    return { allowed: true, reason: "OK", messageCount, messageLimit: limit };
  }
}
