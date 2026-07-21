import { ScheduleEntity } from "../entities/schedule.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ScheduleCreateRepository {
  abstract create(schedule: ScheduleEntity, tx?: TransactionContext): Promise<ScheduleEntity>;
}
