import { Injectable } from "@nestjs/common";
import { ServiceEntity, ServicePricingUnit } from "../../domain/entities/service.entity";
import { ServiceCreateRepository } from "../../domain/repositories/service-create.repository";

export interface CreateServiceInput {
  businessId: string;
  name: string;
  description?: string;
  pricingUnit: ServicePricingUnit;
  duration?: number;
  price: number;
}

@Injectable()
export class CreateServiceUseCase {
  constructor(private readonly serviceCreateRepo: ServiceCreateRepository) {}

  async execute(input: CreateServiceInput): Promise<ServiceEntity> {
    const service = ServiceEntity.create(input);
    return this.serviceCreateRepo.create(service);
  }
}