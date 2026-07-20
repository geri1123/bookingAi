import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { UserCreateRepository } from "../../../users/domain/repositories/user-create.repository";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { PasswordHasher } from "../../../users/domain/services/password-hasher";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { InvitationFindRepository } from "../../domain/repositories/invitation-find.repository";
import { InvitationUpdateRepository } from "../../domain/repositories/invitation-update.repository";
import { InvitationErrorCode } from "../../domain/errors/invitation-error-codes.enum";
import { BusinessMemberEntity } from "../../../business/domain/entities/business-member.entity";
import { BusinessMemberCreateRepository } from "../../../business/domain/repositories/business-member-create.repository";
import { TokenService, IssuedTokens } from "../../../auth/domain/services/token.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

const MIN_PASSWORD_LENGTH = 8;

export interface AcceptInvitationRegisterInput {
  token: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
}

@Injectable()
export class AcceptInvitationRegisterUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly invitationFindRepo: InvitationFindRepository,
    private readonly invitationUpdateRepo: InvitationUpdateRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly userCreateRepo: UserCreateRepository,
    private readonly businessMemberCreateRepo: BusinessMemberCreateRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
    private readonly outboxWriter: OutboxEventWriter, // I RI
  ) {}

  async execute(input: AcceptInvitationRegisterInput): Promise<IssuedTokens> {
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

    if (input.password.length < MIN_PASSWORD_LENGTH) {
      throw new AppException(
        UserErrorCode.WEAK_PASSWORD,
        { min: MIN_PASSWORD_LENGTH, field: "password" },
        HttpStatus.BAD_REQUEST,
      );
    }

    // I RI: marrim inviter-in për ta njoftuar pas pranimit
    const [emailTaken, usernameTaken, inviter] = await Promise.all([
      this.userFindRepo.existsByEmail(invitation.email),
      this.userFindRepo.existsByUsername(input.username),
      this.userFindRepo.findById(invitation.invitedBy),
    ]);

    if (emailTaken) {
      throw new AppException(UserErrorCode.EMAIL_ALREADY_IN_USE, { field: "email" }, HttpStatus.CONFLICT);
    }
    if (usernameTaken) {
      throw new AppException(UserErrorCode.USERNAME_ALREADY_TAKEN, { field: "username" }, HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const user = UserEntity.create({
      username: input.username,
      firstName: input.firstName,
      lastName: input.lastName,
      email: invitation.email,
      password: hashedPassword,
    });

    user.verifyEmail();

    const member = BusinessMemberEntity.create(user.id, invitation.businessId, invitation.role);
    invitation.markAccepted();

    await this.prisma.$transaction(async (tx) => {
      await this.userCreateRepo.create(user, tx);
      await this.businessMemberCreateRepo.create(member, tx);
      await this.invitationUpdateRepo.update(invitation, tx);

      // I RI: event brenda TË NJËJTIT transaksion — atomik me pjesën tjetër
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

    return this.tokenService.issueFullToken({
      userId: user.id,
      businessId: invitation.businessId,
      role: invitation.role,
      rememberMe: false,
    });
  }
}