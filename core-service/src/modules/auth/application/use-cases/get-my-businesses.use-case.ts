import { Injectable } from "@nestjs/common";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { MembershipSummary } from "../../../business/domain/read-models/membership-summary";

@Injectable()
export class GetMyBusinessesUseCase {
  constructor(private readonly businessMemberFindRepo: BusinessMemberFindRepository) {}

  async execute(userId: string): Promise<MembershipSummary[]> {
    return this.businessMemberFindRepo.findByUserId(userId);
  }
}