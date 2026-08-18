import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { PlanTier } from "../../domain/entities/plan.entity";
import { SubscriptionNotificationService } from "./subscription-notification.service";

@Injectable()
export class SubscriptionExpiryCheckerService {
  private readonly logger = new Logger(SubscriptionExpiryCheckerService.name);

  constructor(
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
    private readonly planFindRepo: PlanFindRepository,
    private readonly subscriptionNotification: SubscriptionNotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async checkExpiredSubscriptions(): Promise<void> {
    const now = new Date();
    const expired = await this.subscriptionFindRepo.findActiveExpiringBefore(now);
    if (expired.length === 0) return;

    for (const subscription of expired) {
      try {
        const plan = await this.planFindRepo.findById(subscription.planId);

       
        if (plan?.tier === PlanTier.FREE) {
          const newPeriodStart = now;
          const newPeriodEnd = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
          subscription.renew(newPeriodStart, newPeriodEnd);
          await this.subscriptionWriteRepo.update(subscription);
          this.logger.log(`Plani FREE u rinovua automatikisht per biznesin ${subscription.businessId}`);
          continue;
        }

        subscription.markExpired();
        await this.subscriptionWriteRepo.update(subscription);
        await this.subscriptionNotification.notifyExpiredOnce(subscription.businessId);
      } catch (err) {
        this.logger.error(`Deshtoi per ${subscription.businessId}: ${err}`);
      }
    }
  }
}