import { CustomerEntity } from "../entities/customer.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class CustomerFindRepository {
  abstract findById(id: string): Promise<CustomerEntity | null>;
  abstract findByPhone(businessId: string, phone: string, tx?: TransactionContext): Promise<CustomerEntity | null>;
  abstract findAllByBusiness(businessId: string): Promise<CustomerEntity[]>;
}
