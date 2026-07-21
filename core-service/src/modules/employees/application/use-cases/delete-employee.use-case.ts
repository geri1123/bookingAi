import { HttpStatus, Injectable } from "@nestjs/common";
import { EmployeeFindRepository } from "../../domain/repositories/employee-find.repository";
import { EmployeeDeleteRepository } from "../../domain/repositories/employee-delete.repository";
import { EmployeeErrorCode } from "../../domain/errors/employee-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface DeleteEmployeeInput {
  employeeId: string;
  businessId: string;
}

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly employeeDeleteRepo: EmployeeDeleteRepository,
  ) {}

  async execute(input: DeleteEmployeeInput): Promise<void> {
    const employee = await this.employeeFindRepo.findById(input.employeeId);

    if (!employee || employee.businessId !== input.businessId) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    await this.employeeDeleteRepo.delete(employee.id);
  }
}
