import { EmployeeEntity } from "../entities/employee.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class EmployeeCreateRepository {
  abstract create(employee: EmployeeEntity, tx?: TransactionContext): Promise<EmployeeEntity>;
}
