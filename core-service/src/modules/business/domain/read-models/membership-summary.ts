import { BusinessMemberRole } from "../entities/business-member.entity";

export interface MembershipSummary {
  businessId: string;
  businessName: string;
  role: BusinessMemberRole;
}