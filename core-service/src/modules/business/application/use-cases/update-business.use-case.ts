import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { BusinessUpdateRepository } from "../../domain/repositories/business-update.repositoy";
import { BusinessEntity, BusinessType, BusinessLanguage } from "../../domain/entities/business.entity";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessErrorCode } from "../../domain/errors/business-error-codes.enum";

export interface UpdateBusinessInput {
  businessId: string;
  name?: string;
  type?: BusinessType;
  language?: BusinessLanguage;
  phone?: string;
  email?: string;
  address?: string;
}

@Injectable()
export class UpdateBusinessUseCase {
  constructor(
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly businessUpdateRepo: BusinessUpdateRepository,
  ) {}

  async execute(input: UpdateBusinessInput): Promise<BusinessEntity> {
    const business = await this.businessFindRepo.findById(input.businessId);

    if (!business) {
      throw new AppException(BusinessErrorCode.NOT_FOUND, { field: "businessId" }, HttpStatus.NOT_FOUND);
    }

    business.updateDetails({
      name: input.name,
      type: input.type,
      language: input.language,
      phone: input.phone,
      email: input.email,
      address: input.address,
    });

    return this.businessUpdateRepo.update(business);
  }
}