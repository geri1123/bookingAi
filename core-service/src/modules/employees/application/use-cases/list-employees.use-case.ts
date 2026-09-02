import { Injectable } from "@nestjs/common";
import { EmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeFindRepository } from "../../domain/repositories/employee-find.repository";

const PAGE_SIZE = 20; // FIKS - frontend-i s'mund ta ndryshoje

export interface ListEmployeesInput {
  businessId: string;
  page: number;
}

export interface ListEmployeesOutput {
  items: EmployeeEntity[];
  total: number;
}

@Injectable()
export class ListEmployeesUseCase {
  constructor(private readonly employeeFindRepo: EmployeeFindRepository) {}

  async execute(input: ListEmployeesInput): Promise<ListEmployeesOutput> {
    const skip = (input.page - 1) * PAGE_SIZE;

    const [items, total] = await Promise.all([
      this.employeeFindRepo.findAllByBusiness(input.businessId, { skip, take: PAGE_SIZE }),
      this.employeeFindRepo.countByBusiness(input.businessId),
    ]);

    return { items, total };
  }
}