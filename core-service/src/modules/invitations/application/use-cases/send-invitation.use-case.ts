import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { InvitationEntity } from "../../domain/entities/invitation.entity";
import { InvitationCreateRepository } from "../../domain/repositories/invitation-create.repository";
import { InvitationFindRepository } from "../../domain/repositories/invitation-find.repository";
import { InvitationErrorCode } from "../../domain/errors/invitation-error-codes.enum";
import { BusinessMemberRole } from "../../../business/domain/entities/business-member.entity";
import { TokenGenerator } from "../../../users/domain/services/token-generator";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface SendInvitationInput {
  businessId: string;
  invitedBy: string;
  email: string;
  role: BusinessMemberRole;
}

@Injectable()
export class SendInvitationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invitationCreateRepo: InvitationCreateRepository,
    private readonly invitationFindRepo: InvitationFindRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: SendInvitationInput): Promise<{ invitationId: string }> {
    const inviter = await this.userFindRepo.findById(input.invitedBy);

    if (inviter && inviter.email.toLowerCase() === input.email.toLowerCase()) {
      throw new AppException(InvitationErrorCode.CANNOT_INVITE_SELF, { field: "email" }, HttpStatus.BAD_REQUEST);
    }

    const existingPending = await this.invitationFindRepo.findPendingByEmailAndBusiness(
      input.email,
      input.businessId,
    );
    if (existingPending) {
      throw new AppException(
        InvitationErrorCode.INVITATION_ALREADY_PENDING,
        { field: "email" },
        HttpStatus.CONFLICT,
      );
    }

    const rawToken = this.tokenGenerator.generate();

    const invitation = InvitationEntity.create({
      businessId: input.businessId,
      email: input.email,
      role: input.role,
      invitedBy: input.invitedBy,
      token: rawToken,
    });

    await this.prisma.$transaction(async (tx) => {
      await this.invitationCreateRepo.create(invitation, tx);

      await this.outboxWriter.write(
        EventName.INVITATION_SENT,
        invitation.id,
        {
          invitationId: invitation.id,
          businessId: invitation.businessId,
          email: invitation.email,
          role: invitation.role,
          token: invitation.token,
          inviterFirstName: inviter?.firstName,
        },
        tx,
      );
    });

    return { invitationId: invitation.id };
  }
}