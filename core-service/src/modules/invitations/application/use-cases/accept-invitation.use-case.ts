import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { InvitationFindRepository } from "../../domain/repositories/invitation-find.repository";
import { InvitationUpdateRepository } from "../../domain/repositories/invitation-update.repository";
import { InvitationErrorCode } from "../../domain/errors/invitation-error-codes.enum";
import { BusinessMemberEntity } from "../../../business/domain/entities/business-member.entity";
import { BusinessMemberCreateRepository } from "../../../business/domain/repositories/business-member-create.repository";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { TokenService, IssuedTokens } from "../../../auth/domain/services/token.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface AcceptInvitationInput {
  token: string;
  userId: string;
  rememberMe: boolean;
  isPreAuth: boolean;
}

export interface AcceptInvitationOutput {
  businessId: string;
  autoSwitched: boolean;
  tokens?: IssuedTokens;
}

@Injectable()
export class AcceptInvitationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invitationFindRepo: InvitationFindRepository,
    private readonly invitationUpdateRepo: InvitationUpdateRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly businessMemberCreateRepo: BusinessMemberCreateRepository,
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly tokenService: TokenService,
    private readonly outboxWriter: OutboxEventWriter, // I RI
  ) {}

  async execute(input: AcceptInvitationInput): Promise<AcceptInvitationOutput> {
    const invitation = await this.invitationFindRepo.findByToken(input.token);

    if (!invitation) {
      throw new AppException(InvitationErrorCode.INVITATION_NOT_FOUND, { field: "token" }, HttpStatus.NOT_FOUND);
    }
    if (!invitation.isPending()) {
      throw new AppException(InvitationErrorCode.INVITATION_ALREADY_USED, { field: "token" }, HttpStatus.CONFLICT);
    }
    if (invitation.isExpired()) {
      throw new AppException(InvitationErrorCode.INVITATION_EXPIRED, { field: "token" }, HttpStatus.GONE);
    }

    const user = await this.userFindRepo.findById(input.userId);
    if (!user) {
      throw new AppException(UserErrorCode.USER_NOT_FOUND, { field: "userId" }, HttpStatus.NOT_FOUND);
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      throw new AppException(InvitationErrorCode.INVITATION_NOT_FOUND, { field: "token" }, HttpStatus.FORBIDDEN);
    }

    const alreadyMember = await this.businessMemberFindRepo.isMember(user.id, invitation.businessId);
    if (alreadyMember) {
      throw new AppException(InvitationErrorCode.USER_ALREADY_MEMBER, { field: "businessId" }, HttpStatus.CONFLICT);
    }

    // I RI: marrim inviter-in për njoftim
    const inviter = await this.userFindRepo.findById(invitation.invitedBy);

    const member = BusinessMemberEntity.create(user.id, invitation.businessId, invitation.role);
    invitation.markAccepted();

    await this.prisma.$transaction(async (tx) => {
      await this.businessMemberCreateRepo.create(member, tx);
      await this.invitationUpdateRepo.update(invitation, tx);

      // I RI
      if (inviter) {
        await this.outboxWriter.write(
          EventName.INVITATION_ACCEPTED,
          invitation.id,
          {
            invitationId: invitation.id,
            businessId: invitation.businessId,
            inviterUserId: inviter.id,
            inviterEmail: inviter.email,
            inviterFirstName: inviter.firstName,
            newMemberEmail: user.email,
            newMemberFirstName: user.firstName,
            role: invitation.role,
          },
          tx,
        );
      }
    });

    if (!input.isPreAuth) {
      return { businessId: invitation.businessId, autoSwitched: false };
    }

    const tokens = await this.tokenService.issueFullToken({
      userId: user.id,
      businessId: invitation.businessId,
      role: invitation.role,
      rememberMe: input.rememberMe,
    });

    return { businessId: invitation.businessId, autoSwitched: true, tokens };
  }
}