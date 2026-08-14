import { TransactionContext } from "../domain/transaction-context";

// Port (Hexagonal): shkruan event ne te njejten transaksion DB si ndryshimi i biznesit,
// per te evituar "dual write" problem (shkruan ne DB por deshton te dergoje ne Kafka, ose anasjelltas).
export abstract class OutboxEventWriter {
  abstract write(eventType: string, aggregateId: string, payload: unknown, tx?: TransactionContext): Promise<void>;
}
