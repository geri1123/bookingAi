import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OutboxEventWriter } from "../../../common/events/outbox-event-writer";
import { TransactionContext } from "../../../common/domain/transaction-context";
import { Prisma } from "../../../generated/prisma-client";
@Injectable()
export class PrismaOutboxEventWriter implements OutboxEventWriter {
  constructor(private readonly prisma: PrismaService) {}

  async write(eventType: string, aggregateId: string, payload: unknown, tx?: TransactionContext): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    await client.kafkaEvent.create({
      data: {
        eventType: eventType,
        aggregateId,
        payload: payload as Prisma.InputJsonValue,
        status: "PENDING",
      },
    });
  }
}
