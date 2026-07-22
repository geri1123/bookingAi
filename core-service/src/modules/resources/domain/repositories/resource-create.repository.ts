import { ResourceEntity } from "../entities/resource.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ResourceCreateRepository {
  abstract create(resource: ResourceEntity, tx?: TransactionContext): Promise<ResourceEntity>;
}
