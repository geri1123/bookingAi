import { ResourceEntity } from "../entities/resource.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ResourceUpdateRepository {
  abstract update(resource: ResourceEntity, tx?: TransactionContext): Promise<ResourceEntity>;
}
