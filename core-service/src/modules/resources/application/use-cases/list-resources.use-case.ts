import { Injectable } from "@nestjs/common";
import { ResourceEntity } from "../../domain/entities/resource.entity";
import { ResourceFindRepository } from "../../domain/repositories/resource-find.repository";

const PAGE_SIZE = 20; // FIKS - frontend-i s'mund ta ndryshoje

export interface ListResourcesInput {
  businessId: string;
  page: number;
}

export interface ListResourcesOutput {
  items: ResourceEntity[];
  total: number;
}

@Injectable()
export class ListResourcesUseCase {
  constructor(private readonly resourceFindRepo: ResourceFindRepository) {}

  async execute(input: ListResourcesInput): Promise<ListResourcesOutput> {
    const skip = (input.page - 1) * PAGE_SIZE;

    const [items, total] = await Promise.all([
      this.resourceFindRepo.findAllByBusiness(input.businessId, { skip, take: PAGE_SIZE }),
      this.resourceFindRepo.countByBusiness(input.businessId),
    ]);

    return { items, total };
  }
}