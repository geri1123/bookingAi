import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ScheduleDeleteRepository } from "../../../domain/repositories/schedule-delete.repository";
import { TransactionContext } from "../../../../../common/domain/transaction-context";

@Injectable()
export class PrismaScheduleDeleteRepository implements ScheduleDeleteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string, tx?: TransactionContext): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    await client.schedule.delete({ where: { id } });
  }
}
