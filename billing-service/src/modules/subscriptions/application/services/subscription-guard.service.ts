import { Injectable } from "@nestjs/common";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { UsageCounterRepository } from "../../domain/repositories/usage-counter.repository";
import { SubscriptionAccessPolicy, AiAccessResult } from "../../domain/services/subscription-access-policy";

@Injectable()
export class SubscriptionGuardService {
  constructor(
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly planFindRepo: PlanFindRepository,
    private readonly usageCounterRepo: UsageCounterRepository,
  ) {}

 
  async checkAiAccess(businessId: string): Promise<AiAccessResult> {
    const subscription = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (!subscription) {
      return {
        allowed: false,
        reason: "NO_SUBSCRIPTION",
        messageCount: 0,
        messageLimit: null,
        autoRenew: null,
        currentPeriodEnd: null,
      };
    }

    const [plan, usage] = await Promise.all([
      this.planFindRepo.findById(subscription.planId),
      this.usageCounterRepo.findByBusinessAndPeriod(businessId, subscription.currentPeriodStart),
    ]);

    return SubscriptionAccessPolicy.evaluate(subscription, plan, usage);
  }
}