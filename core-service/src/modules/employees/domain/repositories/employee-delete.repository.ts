import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class EmployeeDeleteRepository {
  abstract delete(id: string, tx?: TransactionContext): Promise<void>;
}
