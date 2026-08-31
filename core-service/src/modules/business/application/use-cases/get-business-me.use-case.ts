import { Injectable, NotFoundException } from "@nestjs/common";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { BusinessMapper } from "../../infrastructure/persistence/mappers/business.mapper";


@Injectable()
export class GetBusinessMe {
  constructor(
    private readonly businessFindRepository: BusinessFindRepository,
  ) {}

  async execute(businessId: string) {
    const business =
      await this.businessFindRepository.findById(businessId);

    if (!business) {
      throw new NotFoundException("Business not found");
    }

    return {
      success: true,
      business: BusinessMapper.toResponse(business),
    };
  }
}