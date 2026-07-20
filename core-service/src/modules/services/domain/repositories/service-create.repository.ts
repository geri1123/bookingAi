import { ServiceEntity } from "../entities/service.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ServiceCreateRepository {
  abstract create(service: ServiceEntity, tx?: TransactionContext): Promise<ServiceEntity>;
}