import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ScheduleDeleteRepository {
  abstract delete(id: string, tx?: TransactionContext): Promise<void>;
}
