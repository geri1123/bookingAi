import { Injectable } from "@nestjs/common";
import { EmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeFindRepository } from "../../domain/repositories/employee-find.repository";

@Injectable()
export class ListEmployeesUseCase {
  constructor(private readonly employeeFindRepo: EmployeeFindRepository) {}

  async execute(businessId: string): Promise<EmployeeEntity[]> {
    return this.employeeFindRepo.findAllByBusiness(businessId);
  }
}
