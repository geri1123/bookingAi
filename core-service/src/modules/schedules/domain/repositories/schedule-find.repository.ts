import { ScheduleEntity } from "../entities/schedule.entity";

export abstract class ScheduleFindRepository {
  abstract findById(id: string): Promise<ScheduleEntity | null>;
  abstract findAllByEmployee(employeeId: string): Promise<ScheduleEntity[]>;
  abstract findOverlapping(
    employeeId: string,
    day: number,
    startTime: string,
    endTime: string,
  ): Promise<ScheduleEntity[]>;
  abstract countByBusiness(businessId: string): Promise<number>;
}
