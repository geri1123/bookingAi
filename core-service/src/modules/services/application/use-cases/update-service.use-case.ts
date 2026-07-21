import { HttpStatus, Injectable } from "@nestjs/common";
import { ServiceEntity } from "../../domain/entities/service.entity";
import { ServiceFindRepository } from "../../domain/repositories/service-find.repository";
import { ServiceUpdateRepository } from "../../domain/repositories/service-update.repository";
import { ServiceErrorCode } from "../../domain/errors/service-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface UpdateServiceInput {
  serviceId: string;
  businessId: string; 
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
}

@Injectable()
export class UpdateServiceUseCase {
  constructor(
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly serviceUpdateRepo: ServiceUpdateRepository,
  ) {}

  async execute(input: UpdateServiceInput): Promise<ServiceEntity> {
    const service = await this.serviceFindRepo.findById(input.serviceId);

    if (!service) {
      throw new AppException(ServiceErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }

    // Mbrojtje kunder IDOR
    if (service.businessId !== input.businessId) {
      throw new AppException(ServiceErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }

    service.updateDetails({
      name: input.name,
      description: input.description,
      duration: input.duration,
      price: input.price,
    });

    return this.serviceUpdateRepo.update(service);
  }
}