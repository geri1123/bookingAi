import { HttpStatus, Injectable } from "@nestjs/common";
import { ResourceFindRepository } from "../../domain/repositories/resource-find.repository";
import { ResourceDeleteRepository } from "../../domain/repositories/resource-delete.repository";
import { ResourceErrorCode } from "../../domain/errors/resource-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";

export interface DeleteResourceInput {
  resourceId: string;
  businessId: string;
}

@Injectable()
export class DeleteResourceUseCase {
  constructor(
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly resourceDeleteRepo: ResourceDeleteRepository,
  ) {}

  async execute(input: DeleteResourceInput): Promise<void> {
    const resource = await this.resourceFindRepo.findById(input.resourceId);

    if (!resource || resource.businessId !== input.businessId) {
      throw new AppException(ResourceErrorCode.NOT_FOUND, { field: "resourceId" }, HttpStatus.NOT_FOUND);
    }

    await this.resourceDeleteRepo.delete(resource.id);
  }
}
