import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { OutboxEventWriter } from "../../../common/events/outbox-event-writer";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaOutboxEventWriter implements OutboxEventWriter {
  constructor(private readonly prisma: PrismaService) {}

  async write(eventType: string, aggregateId: string, payload: unknown, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    await client.kafkaEvent.create({
    data: { eventType, aggregateId, payload: payload as Prisma.InputJsonValue, status: "PENDING" },
    });
  }
}