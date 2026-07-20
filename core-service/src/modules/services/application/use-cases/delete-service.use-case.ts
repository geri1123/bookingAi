import { HttpStatus, Injectable } from "@nestjs/common";
import { ServiceFindRepository } from "../../domain/repositories/service-find.repository";
import { ServiceDeleteRepository } from "../../domain/repositories/service-delete.repository";
import { ServiceErrorCode } from "../../domain/errors/service-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface DeleteServiceInput {
  serviceId: string;
  businessId: string;
}

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly serviceDeleteRepo: ServiceDeleteRepository,
  ) {}

  async execute(input: DeleteServiceInput): Promise<void> {
    const service = await this.serviceFindRepo.findById(input.serviceId);

    if (!service || service.businessId !== input.businessId) {
      throw new AppException(ServiceErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }

    await this.serviceDeleteRepo.delete(service.id);
  }
}