import { EmployeeEntity } from "../entities/employee.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class EmployeeUpdateRepository {
  abstract update(employee: EmployeeEntity, tx?: TransactionContext): Promise<EmployeeEntity>;
}
