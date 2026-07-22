import { CustomerEntity } from "../entities/customer.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class CustomerCreateRepository {
  abstract create(customer: CustomerEntity, tx?: TransactionContext): Promise<CustomerEntity>;
}
