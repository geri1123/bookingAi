import { Schedule as PrismaSchedule, Prisma } from "@prisma/client";
import { ScheduleEntity } from "../../../domain/entities/schedule.entity";

export class ScheduleMapper {
  static toDomain(raw: PrismaSchedule): ScheduleEntity {
    return ScheduleEntity.reconstitute({
      id: raw.id,
      employeeId: raw.employeeId,
      day: raw.day,
      startTime: raw.startTime,
      endTime: raw.endTime,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(entity: ScheduleEntity): Prisma.ScheduleUncheckedCreateInput {
    const props = entity.toPersistence();
    return {
      id: props.id,
      employeeId: props.employeeId,
      day: props.day,
      startTime: props.startTime,
      endTime: props.endTime,
    };
  }
}
