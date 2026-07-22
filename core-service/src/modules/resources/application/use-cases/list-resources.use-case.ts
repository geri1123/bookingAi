import { Injectable } from "@nestjs/common";
import { ResourceEntity } from "../../domain/entities/resource.entity";
import { ResourceFindRepository } from "../../domain/repositories/resource-find.repository";

@Injectable()
export class ListResourcesUseCase {
  constructor(private readonly resourceFindRepo: ResourceFindRepository) {}

  async execute(businessId: string): Promise<ResourceEntity[]> {
    return this.resourceFindRepo.findAllByBusiness(businessId);
  }
}
