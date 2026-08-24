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

  @Cron(CronExpression.EVERY_30_SECONDS)
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

         if (!subscription.autoRenew) {
          const freePlan = await this.planFindRepo.findByTier(PlanTier.FREE);
          if (freePlan) {
            const newPeriodStart = now;
            const newPeriodEnd = new Date(now.getTime() + freePlan.durationDays * 24 * 60 * 60 * 1000);
            // autoRenew=false EKSPLICITISHT: biznesi ka anuluar me dashje, s'ka
            // pagese aktive - s'duhet te dali si "auto-renew: ON" ne FREE.
            subscription.changePlan(freePlan.id, newPeriodStart, newPeriodEnd, false);
            // Subscription-i i vjeter ne Paddle tashme eshte CANCELED - hiqe
            // referencen, perndryshe upgrade-checkout i ardhshem do provonte
            // gabimisht ta PATCH-onte ne vend qe te krijonte checkout te ri.
            subscription.clearPaymentReference();
            await this.subscriptionWriteRepo.update(subscription);
            await this.subscriptionNotification.notifyDowngradedToFree(subscription.businessId);
            this.logger.log(`Biznesi ${subscription.businessId} u kthye ne FREE pas anulimit.`);
            continue;
          }
        }

        // ACTIVE por s'u rinovua (pagesa deshtoi / Paddle s'dergoi
        // transaction.completed ne kohe) - EXPIRED real, jo downgrade i qete.
        subscription.markExpired();
        await this.subscriptionWriteRepo.update(subscription);
        await this.subscriptionNotification.notifyExpiredOnce(subscription.businessId);
      } catch (err) {
        this.logger.error(`Deshtoi per ${subscription.businessId}: ${err}`);
      }
    }
  }
}