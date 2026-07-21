import { HttpStatus, Injectable } from "@nestjs/common";
import { EmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeFindRepository } from "../../domain/repositories/employee-find.repository";
import { EmployeeUpdateRepository } from "../../domain/repositories/employee-update.repository";
import { EmployeeErrorCode } from "../../domain/errors/employee-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface UpdateEmployeeInput {
  employeeId: string;
  businessId: string;
  name?: string;
  phone?: string;
}

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly employeeUpdateRepo: EmployeeUpdateRepository,
  ) {}

  async execute(input: UpdateEmployeeInput): Promise<EmployeeEntity> {
    const employee = await this.employeeFindRepo.findById(input.employeeId);

    if (!employee || employee.businessId !== input.businessId) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    employee.updateDetails({ name: input.name, phone: input.phone });

    return this.employeeUpdateRepo.update(employee);
  }
}
