import { HttpStatus, Injectable } from "@nestjs/common";
import { ScheduleEntity } from "../../domain/entities/schedule.entity";
import { ScheduleFindRepository } from "../../domain/repositories/schedule-find.repository";
import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { EmployeeErrorCode } from "../../../employees/domain/errors/employee-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface ListSchedulesInput {
  employeeId: string;
  businessId: string;
}

@Injectable()
export class ListSchedulesByEmployeeUseCase {
  constructor(
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
  ) {}

  async execute(input: ListSchedulesInput): Promise<ScheduleEntity[]> {
    const employee = await this.employeeFindRepo.findById(input.employeeId);

    if (!employee || employee.businessId !== input.businessId) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    return this.scheduleFindRepo.findAllByEmployee(input.employeeId);
  }
}
