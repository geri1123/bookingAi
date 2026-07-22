import { TransactionContext } from "../domain/transaction-context";

export abstract class OutboxEventWriter {
  abstract write(eventType: string, aggregateId: string, payload: unknown, tx?: TransactionContext): Promise<void>;
}