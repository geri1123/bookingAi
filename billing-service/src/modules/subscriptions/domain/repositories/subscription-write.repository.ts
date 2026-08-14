import { SubscriptionEntity } from "../entities/subscription.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class SubscriptionWriteRepository {
  abstract create(subscription: SubscriptionEntity, tx?: TransactionContext): Promise<SubscriptionEntity>;
  abstract update(subscription: SubscriptionEntity, tx?: TransactionContext): Promise<SubscriptionEntity>;
}
