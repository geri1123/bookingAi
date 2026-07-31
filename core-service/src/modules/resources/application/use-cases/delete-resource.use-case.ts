import { HttpStatus, Injectable } from "@nestjs/common";
import { ResourceFindRepository } from "../../domain/repositories/resource-find.repository";
import { ResourceDeleteRepository } from "../../domain/repositories/resource-delete.repository";
import { ResourceErrorCode } from "../../domain/errors/resource-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";

export interface DeleteResourceInput {
  resourceId: string;
  businessId: string;
}

@Injectable()
export class DeleteResourceUseCase {
  constructor(
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly resourceDeleteRepo: ResourceDeleteRepository,
    private readonly businessFindRepo: BusinessFindRepository,
  ) {}

  async execute(input: DeleteResourceInput): Promise<void> {
    const resource = await this.resourceFindRepo.findById(input.resourceId);

    if (!resource || resource.businessId !== input.businessId) {
      throw new AppException(ResourceErrorCode.NOT_FOUND, { field: "resourceId" }, HttpStatus.NOT_FOUND);
    }

    const business = await this.businessFindRepo.findById(input.businessId);
    const needsResource = business ? ACTIVATION_REQUIREMENTS[business.type].needsResource : false;

    if (needsResource) {
      const count = await this.resourceFindRepo.countByBusiness(input.businessId);
      if (count <= 1) {
        throw new AppException(
          ResourceErrorCode.CANNOT_DELETE_LAST_RESOURCE,
          { field: "resourceId" },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    await this.resourceDeleteRepo.delete(resource.id);
  }
}