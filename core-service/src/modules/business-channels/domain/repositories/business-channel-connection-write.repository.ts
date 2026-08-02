import { BusinessChannelConnectionEntity } from "../entities/business-channel-connection.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class BusinessChannelConnectionWriteRepository {
  abstract create(
    connection: BusinessChannelConnectionEntity,
    tx?: TransactionContext,
  ): Promise<BusinessChannelConnectionEntity>;

  abstract update(
    connection: BusinessChannelConnectionEntity,
    tx?: TransactionContext,
  ): Promise<BusinessChannelConnectionEntity>;
}
