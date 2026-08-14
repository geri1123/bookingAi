import { SubscriptionEntity } from "../entities/subscription.entity";

export abstract class SubscriptionFindRepository {
  abstract findByBusinessId(businessId: string): Promise<SubscriptionEntity | null>;

  // Perdoret nga job-e periodike (p.sh. cron qe kalon ne EXPIRED subscriptions
  // qe kane kaluar currentPeriodEnd pa u rinovuar).
  abstract findActiveExpiringBefore(date: Date): Promise<SubscriptionEntity[]>;
}
