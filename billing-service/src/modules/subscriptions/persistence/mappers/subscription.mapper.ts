import { Subscription as  PrismaSubscription} from "../../../../generated/prisma-client";
import { SubscriptionEntity, SubscriptionStatus } from "../../domain/entities/subscription.entity";

export class SubscriptionMapper {
  static toDomain(raw: PrismaSubscription): SubscriptionEntity {
    return SubscriptionEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      planId: raw.planId,
      status: raw.status as SubscriptionStatus,
      autoRenew: raw.autoRenew,
      currentPeriodStart: raw.currentPeriodStart,
      currentPeriodEnd: raw.currentPeriodEnd,
      paymentProvider: raw.paymentProvider,
      externalReference: raw.externalReference,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: SubscriptionEntity) {
    const props = entity.toPersistence();
   
    return {
      id: props.id,
      businessId: props.businessId,
      planId: props.planId,
      status: props.status,
      autoRenew: props.autoRenew,
      currentPeriodStart: props.currentPeriodStart,
      currentPeriodEnd: props.currentPeriodEnd,
      paymentProvider: props.paymentProvider,
      externalReference: props.externalReference,
    };
  }
}
