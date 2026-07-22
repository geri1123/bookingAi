import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ResourceDeleteRepository {
  abstract delete(id: string, tx?: TransactionContext): Promise<void>;
}
