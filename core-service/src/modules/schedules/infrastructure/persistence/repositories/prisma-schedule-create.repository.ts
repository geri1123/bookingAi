import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ScheduleCreateRepository } from "../../../domain/repositories/schedule-create.repository";
import { ScheduleEntity } from "../../../domain/entities/schedule.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ScheduleMapper } from "../mappers/schedule.mapper";

@Injectable()
export class PrismaScheduleCreateRepository implements ScheduleCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(schedule: ScheduleEntity, tx?: TransactionContext): Promise<ScheduleEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.schedule.create({ data: ScheduleMapper.toPersistence(schedule) });
    return ScheduleMapper.toDomain(created);
  }
}
