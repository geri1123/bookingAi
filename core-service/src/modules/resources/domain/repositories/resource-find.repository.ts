import { ResourceEntity } from "../entities/resource.entity";

export abstract class ResourceFindRepository {
  abstract findById(id: string): Promise<ResourceEntity | null>;
  abstract findAllByBusiness(businessId: string): Promise<ResourceEntity[]>;
  abstract countByBusiness(businessId: string): Promise<number>;
}
