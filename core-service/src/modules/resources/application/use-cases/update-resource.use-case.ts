import { HttpStatus, Injectable } from "@nestjs/common";
import { ResourceEntity, ResourceType } from "../../domain/entities/resource.entity";
import { ResourceFindRepository } from "../../domain/repositories/resource-find.repository";
import { ResourceUpdateRepository } from "../../domain/repositories/resource-update.repository";
import { ResourceErrorCode } from "../../domain/errors/resource-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface UpdateResourceInput {
  resourceId: string;
  businessId: string;
  name?: string;
  type?: ResourceType;
  capacity?: number;
  serviceId?: string;
}

@Injectable()
export class UpdateResourceUseCase {
  constructor(
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly resourceUpdateRepo: ResourceUpdateRepository,
  ) {}

  async execute(input: UpdateResourceInput): Promise<ResourceEntity> {
    const resource = await this.resourceFindRepo.findById(input.resourceId);

    if (!resource || resource.businessId !== input.businessId) {
      throw new AppException(ResourceErrorCode.NOT_FOUND, { field: "resourceId" }, HttpStatus.NOT_FOUND);
    }

    const serviceId = input.serviceId === undefined ? undefined : input.serviceId === "" ? null : input.serviceId;

    resource.updateDetails({ name: input.name, type: input.type, capacity: input.capacity, serviceId });

    return this.resourceUpdateRepo.update(resource);
  }
}