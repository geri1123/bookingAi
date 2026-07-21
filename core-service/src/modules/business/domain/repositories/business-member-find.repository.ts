import { BusinessMemberEntity } from "../entities/business-member.entity";
import { MembershipSummary } from "../read-models/membership-summary";

export abstract class BusinessMemberFindRepository {
  abstract findByUserId(userId: string): Promise<MembershipSummary[]>;
  abstract isMember(userId: string, businessId: string): Promise<boolean>;
  abstract findMembership(userId: string, businessId: string): Promise<MembershipSummary | null>;
   abstract findOwner(businessId: string): Promise<BusinessMemberEntity | null>;
}