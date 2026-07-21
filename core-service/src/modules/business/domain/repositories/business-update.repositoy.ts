import { BusinessEntity } from "../entities/business.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class BusinessUpdateRepository {
  abstract update(business: BusinessEntity, tx?: TransactionContext): Promise<BusinessEntity>;
}