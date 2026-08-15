import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";
import { Public } from "@bookingai/auth";
import { InternalApiKeyGuard } from "../../../../common/guards/internal-api-key.guard";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { BusinessMemberFindRepository } from "../../domain/repositories/business-member-find.repository";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";

// Perdoret nga billing-service kur nje biznes arrin limitin e mesazheve AI,
// per te ditur ku t'i dergoje email-in e njoftimit.
@Public()
@UseGuards(InternalApiKeyGuard)
@Controller("internal/businesses")
export class InternalBusinessController {
  constructor(
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly memberFindRepo: BusinessMemberFindRepository,
    private readonly userFindRepo: UserFindRepository,
  ) {}

  @Get(":businessId/contact")
  async getContact(@Param("businessId") businessId: string) {
    const business = await this.businessFindRepo.findById(businessId);
    if (!business) {
      throw new NotFoundException("Business not found");
    }

    const ownerMember = await this.memberFindRepo.findOwner(businessId);
    const owner = ownerMember ? await this.userFindRepo.findById(ownerMember.userId) : null;

    return {
      businessId: business.id,
      businessName: business.name,
      ownerEmail: owner?.email ?? business.email ?? null,
      ownerFirstName: owner?.firstName ?? null,
    };
  }
}