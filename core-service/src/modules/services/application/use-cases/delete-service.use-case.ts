import { HttpStatus, Injectable } from "@nestjs/common";
import { ServiceFindRepository } from "../../domain/repositories/service-find.repository";
import { ServiceDeleteRepository } from "../../domain/repositories/service-delete.repository";
import { ServiceErrorCode } from "../../domain/errors/service-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";

export interface DeleteServiceInput {
  serviceId: string;
  businessId: string;
}

@Injectable()
export class DeleteServiceUseCase {
  constructor(
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly serviceDeleteRepo: ServiceDeleteRepository,
    private readonly businessFindRepo: BusinessFindRepository,
  ) {}

  async execute(input: DeleteServiceInput): Promise<void> {
    const service = await this.serviceFindRepo.findById(input.serviceId);

    if (!service || service.businessId !== input.businessId) {
      throw new AppException(ServiceErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }

    const business = await this.businessFindRepo.findById(input.businessId);
    const needsService = business ? ACTIVATION_REQUIREMENTS[business.type].needsService : false;

    if (needsService) {
      const count = await this.serviceFindRepo.countByBusiness(input.businessId);
      if (count <= 1) {
        throw new AppException(
          ServiceErrorCode.CANNOT_DELETE_LAST_SERVICE,
          { field: "serviceId" },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.serviceDeleteRepo.delete(service.id);
  }
}