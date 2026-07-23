import { TransactionContext } from "../../../../common/domain/transaction-context";
import { ResourceEntity } from "../entities/resource.entity";

export abstract class ResourceFindRepository {
  abstract findById(id: string): Promise<ResourceEntity | null>;
  abstract findAllByBusiness(businessId: string): Promise<ResourceEntity[]>;
  abstract countByBusiness(businessId: string): Promise<number>;
   abstract findFirstAvailable(
    businessId: string,
    startTime: Date,
    endTime: Date,
    minCapacity: number | undefined,
    tx?: TransactionContext,
  ): Promise<ResourceEntity | null>;
}
