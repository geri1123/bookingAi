import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ScheduleFindRepository } from "../../../domain/repositories/schedule-find.repository";
import { ScheduleEntity } from "../../../domain/entities/schedule.entity";
import { ScheduleMapper } from "../mappers/schedule.mapper";

@Injectable()
export class PrismaScheduleFindRepository implements ScheduleFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ScheduleEntity | null> {
    const raw = await this.prisma.schedule.findUnique({ where: { id } });
    return raw ? ScheduleMapper.toDomain(raw) : null;
  }

  async findAllByEmployee(employeeId: string): Promise<ScheduleEntity[]> {
    const rows = await this.prisma.schedule.findMany({
      where: { employeeId },
      orderBy: [{ day: "asc" }, { startTime: "asc" }],
    });
    return rows.map(ScheduleMapper.toDomain);
  }

  async findOverlapping(
    employeeId: string,
    day: number,
    startTime: string,
    endTime: string,
  ): Promise<ScheduleEntity[]> {
    const rows = await this.prisma.schedule.findMany({
      where: {
        employeeId,
        day,
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    return rows.map(ScheduleMapper.toDomain);
  }

  async countByBusiness(businessId: string): Promise<number> {
    return this.prisma.schedule.count({
      where: { employee: { businessId } },
    });
  }
}
