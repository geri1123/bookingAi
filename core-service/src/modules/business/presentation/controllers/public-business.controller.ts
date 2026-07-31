import { Controller, Get, HttpCode, HttpStatus, NotFoundException, Param } from "@nestjs/common";
import { Public } from "@bookingai/auth";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";


@Controller("public/:businessId")
export class PublicBusinessController {
  constructor(private readonly businessFindRepo: BusinessFindRepository) {}

  @Public()
  @Get("info")
  @HttpCode(HttpStatus.OK)
  async info(@Param("businessId") businessId: string) {
    const business = await this.businessFindRepo.findById(businessId);
    if (!business) {
      throw new NotFoundException("Business not found");
    }

    const requirements = ACTIVATION_REQUIREMENTS[business.type];

    return {
      success: true,
      business: {
        id: business.id,
        name: business.name,
        type: business.type,
        language: business.language,
        timezone: business.timezone,
        needsEmployee: requirements.needsEmployee,
        needsResource: requirements.needsResource,
      },
    };
  }
}