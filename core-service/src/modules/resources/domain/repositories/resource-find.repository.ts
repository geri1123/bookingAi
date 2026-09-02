import { ResourceEntity } from "../entities/resource.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ResourceFindRepository {
  abstract findById(id: string): Promise<ResourceEntity | null>;
  abstract findAllByBusiness(
    businessId: string,
    params?: { skip?: number; take?: number }
  ): Promise<ResourceEntity[]>;
  abstract countByBusiness(businessId: string): Promise<number>;
  abstract findFirstAvailable(
    businessId: string,
    startTime: Date,
    endTime: Date,
    minCapacity: number | undefined,
    serviceId: string | undefined,
    tx?: TransactionContext,
  ): Promise<ResourceEntity | null>;
}