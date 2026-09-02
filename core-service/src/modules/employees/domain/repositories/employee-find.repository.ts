import { EmployeeEntity } from "../entities/employee.entity";

export abstract class EmployeeFindRepository {
  abstract findById(id: string): Promise<EmployeeEntity | null>;
    abstract findAllByBusiness(
    businessId: string,
    params?: { skip?: number; take?: number }
  ): Promise<EmployeeEntity[]>;
  abstract countByBusiness(businessId: string): Promise<number>;
}
