import { Injectable } from "@nestjs/common";
import { InvitationFindRepository } from "../../domain/repositories/invitation-find.repository";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";

export interface InvitationPreviewOutput {
  valid: boolean;
  email?: string;
  businessName?: string;
  role?: string;
  userExists?: boolean;
}

@Injectable()
export class GetInvitationPreviewUseCase {
  constructor(
    private readonly invitationFindRepo: InvitationFindRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly businessFindRepo: BusinessFindRepository,
  ) {}

  async execute(token: string): Promise<InvitationPreviewOutput> {
    const invitation = await this.invitationFindRepo.findByToken(token);

    if (!invitation || !invitation.isPending() || invitation.isExpired()) {
      return { valid: false };
    }

    const [existingUser, business] = await Promise.all([
      this.userFindRepo.findByEmail(invitation.email),
      this.businessFindRepo.findById(invitation.businessId),
    ]);

    return {
      valid: true,
      email: invitation.email,
      role: invitation.role,
      businessName: business?.name,
      userExists: !!existingUser,
    };
  }
}