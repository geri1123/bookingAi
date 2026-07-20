import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ServiceDeleteRepository {
  abstract delete(id: string, tx?: TransactionContext): Promise<void>;
}