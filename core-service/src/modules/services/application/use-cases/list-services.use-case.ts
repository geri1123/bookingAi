import { Injectable } from "@nestjs/common";
import { ServiceEntity } from "../../domain/entities/service.entity";
import { ServiceFindRepository } from "../../domain/repositories/service-find.repository";

export interface ListServicesInput {
  businessId: string;
  page?: number;   // OPSIONALE - kur mungon, kthen GJITHÇKA (rasti i AI-se)
  limit?: number;
}

export interface ListServicesOutput {
  items: ServiceEntity[];
  total: number;
}

@Injectable()
export class ListServicesUseCase {
  constructor(private readonly serviceFindRepo: ServiceFindRepository) {}

  async execute(input: ListServicesInput): Promise<ListServicesOutput> {
  
    const params =
      input.page && input.limit
        ? { skip: (input.page - 1) * input.limit, take: input.limit }
        : undefined;

    const [items, total] = await Promise.all([
      this.serviceFindRepo.findAllByBusiness(input.businessId, params),
      this.serviceFindRepo.countByBusiness(input.businessId),
    ]);

    return { items, total };
  }
}