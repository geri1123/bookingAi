// billing-service/.../application/services/subscription-expiry-checker.service.ts (I RI)
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { SubscriptionNotificationService } from "./subscription-notification.service";

@Injectable()
export class SubscriptionExpiryCheckerService {
  private readonly logger = new Logger(SubscriptionExpiryCheckerService.name);

  constructor(
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
    private readonly subscriptionNotification: SubscriptionNotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async checkExpiredSubscriptions(): Promise<void> {
    const now = new Date();
    const expired = await this.subscriptionFindRepo.findActiveExpiringBefore(now);
    if (expired.length === 0) return;

    for (const subscription of expired) {
      try {
        subscription.markExpired();                                                    
        await this.subscriptionWriteRepo.update(subscription);
        await this.subscriptionNotification.notifyExpiredOnce(subscription.businessId); 
      } catch (err) {
        this.logger.error(`Deshtoi per ${subscription.businessId}: ${err}`);
      }
    }
  }
}