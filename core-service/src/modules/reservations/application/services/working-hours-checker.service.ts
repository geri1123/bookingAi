import { Injectable } from "@nestjs/common";
import { ScheduleFindRepository } from "../../../schedules/domain/repositories/schedule-find.repository";
import { toHHMM, dayOfWeekOf } from "../../../../common/utils/time";

@Injectable()
export class WorkingHoursCheckerService {
  constructor(private readonly scheduleFindRepo: ScheduleFindRepository) {}

  async isWithinWorkingHours(
    employeeId: string,
    startTime: Date,
    endTime: Date,
    businessTimezone: string,
  ): Promise<boolean> {
    const dayOfWeek = dayOfWeekOf(startTime, businessTimezone);
    const schedules = (await this.scheduleFindRepo.findAllByEmployee(employeeId)).filter(
      (s) => s.day === dayOfWeek,
    );

    if (schedules.length === 0) return false;

    const startHHMM = toHHMM(startTime, businessTimezone);
    const endHHMM = toHHMM(endTime, businessTimezone);

    return schedules.some((s) => startHHMM >= s.startTime && endHHMM <= s.endTime);
  }
}