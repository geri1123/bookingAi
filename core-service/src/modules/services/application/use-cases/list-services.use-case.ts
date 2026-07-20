import { Injectable } from "@nestjs/common";
import { ServiceEntity } from "../../domain/entities/service.entity";
import { ServiceFindRepository } from "../../domain/repositories/service-find.repository";

@Injectable()
export class ListServicesUseCase {
  constructor(private readonly serviceFindRepo: ServiceFindRepository) {}

  async execute(businessId: string): Promise<ServiceEntity[]> {
    return this.serviceFindRepo.findAllByBusiness(businessId);
  }
}