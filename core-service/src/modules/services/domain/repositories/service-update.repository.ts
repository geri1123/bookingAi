import { ServiceEntity } from "../entities/service.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ServiceUpdateRepository {
  abstract update(service: ServiceEntity, tx?: TransactionContext): Promise<ServiceEntity>;
}