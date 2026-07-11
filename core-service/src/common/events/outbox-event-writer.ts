import { Prisma } from "@prisma/client";

export abstract class OutboxEventWriter {
  abstract write(eventType: string, aggregateId: string, payload: unknown, tx?: Prisma.TransactionClient): Promise<void>;
}