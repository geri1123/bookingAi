import { HttpStatus, Injectable } from "@nestjs/common";
import { EmployeeFindRepository } from "../../domain/repositories/employee-find.repository";
import { EmployeeDeleteRepository } from "../../domain/repositories/employee-delete.repository";
import { EmployeeErrorCode } from "../../domain/errors/employee-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";

export interface DeleteEmployeeInput {
  employeeId: string;
  businessId: string;
}

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly employeeDeleteRepo: EmployeeDeleteRepository,
    private readonly businessFindRepo: BusinessFindRepository,
  ) {}

  async execute(input: DeleteEmployeeInput): Promise<void> {
    const employee = await this.employeeFindRepo.findById(input.employeeId);

    if (!employee || employee.businessId !== input.businessId) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    const business = await this.businessFindRepo.findById(input.businessId);
    const needsEmployee = business ? ACTIVATION_REQUIREMENTS[business.type].needsEmployee : false;

    if (needsEmployee) {
      const count = await this.employeeFindRepo.countByBusiness(input.businessId);
      if (count <= 1) {
        throw new AppException(
          EmployeeErrorCode.CANNOT_DELETE_LAST_EMPLOYEE,
          { field: "employeeId" },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.employeeDeleteRepo.delete(employee.id);
  }
}