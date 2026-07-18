import { InvitationEntity } from "../entities/invitation.entity";

export abstract class InvitationFindRepository {
  abstract findByToken(token: string): Promise<InvitationEntity | null>;
  abstract findPendingByEmailAndBusiness(email: string, businessId: string): Promise<InvitationEntity | null>;
}