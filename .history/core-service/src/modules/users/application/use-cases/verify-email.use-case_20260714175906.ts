import { Injectable, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { UserUpdateRepository } from "../../domain/repositories/user-update.repository";
import { TokenType } from "../../domain/entities/verification-token.entity";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../domain/errors/user-error-codes.enum";
import { EventName } from "../../../../common/events/event-name.enum";
import { PrismaOutboxEventWriter } from "../../../../infrastructure/persistence/outbox/prisma-outbox-event-writer";

export interface VerifyEmailInput {
  token: string;
}

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly userUpdateRepo: UserUpdateRepository,
    private readonly outboxWriter:PrismaOutboxEventWriter
  ) {}

  async execute(input: VerifyEmailInput): Promise<void> {
    const verificationToken = await this.tokenRepo.findByToken(input.token);

    if (!verificationToken || verificationToken.type !== TokenType.EMAIL_VERIFICATION) {
      throw new AppException(
        UserErrorCode.TOKEN_NOT_FOUND,
        { field: "token" },
        HttpStatus.NOT_FOUND,
      );
    }

    // Kontrollo perdorimin PARA skadimit — nese token-i eshte perdorur tashme,
    // useri s'ka nevoje te dije nese eshte skaduar apo jo, thjesht qe s'eshte i vlefshem me.
    if (verificationToken.isUsed()) {
      throw new AppException(
        UserErrorCode.TOKEN_ALREADY_USED,
        { field: "token" },
        HttpStatus.CONFLICT,
      );
    }

    if (verificationToken.isExpired()) {
      throw new AppException(
        UserErrorCode.TOKEN_EXPIRED,
        { field: "token" },
        HttpStatus.GONE,
      );
    }

    const user = await this.userFindRepo.findById(verificationToken.userId);

    if (!user) {
      throw new AppException(
        UserErrorCode.USER_NOT_FOUND,
        { field: "userId" },
        HttpStatus.NOT_FOUND,
      );
    }

   
    if (user.emailVerifiedAt) {
      return;
    }

    user.verifyEmail();

   await this.prisma.$transaction(async (tx) => {
      await this.userUpdateRepo.update(
        user.id,
        { status: user.status, emailVerifiedAt: user.emailVerifiedAt },
        tx,
      );
      await this.tokenRepo.markAsUsed(verificationToken.id, tx);
      await this.outboxWriter.write(
        EventName.USER_WELCOME_EMAIL_REQUESTED,
        user.id,
        { userId: user.id, email: user.email, firstName: user.firstName },
        tx,
      );
    });
  }
}
