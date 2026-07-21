import { HttpStatus, Injectable } from "@nestjs/common";
import { ScheduleFindRepository } from "../../domain/repositories/schedule-find.repository";
import { ScheduleDeleteRepository } from "../../domain/repositories/schedule-delete.repository";
import { ScheduleErrorCode } from "../../domain/errors/schedule-error-codes.enum";
import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface DeleteScheduleInput {
  scheduleId: string;
  businessId: string;
}

@Injectable()
export class DeleteScheduleUseCase {
  constructor(
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly scheduleDeleteRepo: ScheduleDeleteRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
  ) {}

  async execute(input: DeleteScheduleInput): Promise<void> {
    const schedule = await this.scheduleFindRepo.findById(input.scheduleId);

    if (!schedule) {
      throw new AppException(ScheduleErrorCode.SCHEDULE_NOT_FOUND, { field: "scheduleId" }, HttpStatus.NOT_FOUND);
    }

    // Verifikim IDOR: schedule -> employee -> businessId
    const employee = await this.employeeFindRepo.findById(schedule.employeeId);
    if (!employee || employee.businessId !== input.businessId) {
      throw new AppException(ScheduleErrorCode.SCHEDULE_NOT_FOUND, { field: "scheduleId" }, HttpStatus.NOT_FOUND);
    }

    await this.scheduleDeleteRepo.delete(schedule.id);
  }
}
