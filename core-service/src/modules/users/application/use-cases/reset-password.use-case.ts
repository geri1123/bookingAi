import { Injectable, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { UserUpdateRepository } from "../../domain/repositories/user-update.repository";
import { TokenType } from "../../domain/entities/verification-token.entity";
import { PasswordHasher } from "../../domain/services/password-hasher";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../domain/errors/user-error-codes.enum";

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly userUpdateRepo: UserUpdateRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    if (input.newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new AppException(
        UserErrorCode.WEAK_PASSWORD,
        { min: MIN_PASSWORD_LENGTH, field: "newPassword" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const resetToken = await this.tokenRepo.findByToken(input.token);

    if (!resetToken || resetToken.type !== TokenType.PASSWORD_RESET) {
      throw new AppException(
        UserErrorCode.TOKEN_NOT_FOUND,
        { field: "token" },
        HttpStatus.NOT_FOUND,
      );
    }

    if (resetToken.isUsed()) {
      throw new AppException(
        UserErrorCode.TOKEN_ALREADY_USED,
        { field: "token" },
        HttpStatus.CONFLICT,
      );
    }

    if (resetToken.isExpired()) {
      throw new AppException(
        UserErrorCode.TOKEN_EXPIRED,
        { field: "token" },
        HttpStatus.GONE,
      );
    }

    const user = await this.userFindRepo.findById(resetToken.userId);

    if (!user) {
      throw new AppException(
        UserErrorCode.USER_NOT_FOUND,
        { field: "userId" },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await this.passwordHasher.hash(input.newPassword);

    await this.prisma.$transaction(async (tx) => {
      await this.userUpdateRepo.update(user.id, { password: hashedPassword }, tx);
      await this.tokenRepo.markAsUsed(resetToken.id, tx);
    
      await this.tokenRepo.invalidateActiveTokens(user.id, TokenType.PASSWORD_RESET, tx);
    });
  }
}