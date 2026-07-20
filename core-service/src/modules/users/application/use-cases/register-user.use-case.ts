import { Injectable, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { UserEntity } from "../../domain/entities/user.entity";
import { VerificationTokenEntity, TokenType } from "../../domain/entities/verification-token.entity";
import { UserCreateRepository } from "../../domain/repositories/user-create.repository";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { VerificationTokenRepository } from "../../domain/repositories/verification-token.repository";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { PasswordHasher } from "../../domain/services/password-hasher";
import { TokenGenerator } from "../../domain/services/token-generator";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../domain/errors/user-error-codes.enum";
import { EventName } from "../../../../common/events/event-name.enum";
import { EmailAlreadyExistsError } from "../../domain/errors/email-already-exists.error";
import { UsernameAlreadyTakenError } from "../../domain/errors/username-already-taken.error";

export interface RegisterUserInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const MIN_PASSWORD_LENGTH = 8;

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userCreateRepo: UserCreateRepository,
    private readonly userFindRepo: UserFindRepository,
    private readonly tokenRepo: VerificationTokenRepository,
    private readonly outboxWriter: OutboxEventWriter,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async execute(input: RegisterUserInput): Promise<UserEntity> {
    if (input.password.length < MIN_PASSWORD_LENGTH) {
      throw new AppException(
        UserErrorCode.WEAK_PASSWORD,
        {
          min: MIN_PASSWORD_LENGTH,
          field: "password",
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Fast-path check: mesazh i shpejtë për UX, JO burimi i vetëm i konsistencës.
    // Mbrojtja reale kundër race condition-it është unique constraint + catch below.
    const [emailTaken, usernameTaken] = await Promise.all([
      this.userFindRepo.existsByEmail(input.email),
      this.userFindRepo.existsByUsername(input.username),
    ]);

    if (emailTaken) {
      throw new AppException(
        UserErrorCode.EMAIL_ALREADY_IN_USE,
        { field: "email" },
        HttpStatus.CONFLICT,
      );
    }

    if (usernameTaken) {
      throw new AppException(
        UserErrorCode.USERNAME_ALREADY_TAKEN,
        { field: "username" },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const user = UserEntity.create({ ...input, password: hashedPassword });
    const rawToken = this.tokenGenerator.generate();
    const verificationToken = VerificationTokenEntity.create(user.id, rawToken, TokenType.EMAIL_VERIFICATION);

    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] Verification token per ${user.email}: ${rawToken}`);
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        await this.userCreateRepo.create(user, tx);
        await this.tokenRepo.create(verificationToken, tx);
        await this.outboxWriter.write(
          EventName.USER_EMAIL_VERIFICATION_REQUESTED,
          user.id,
          { userId: user.id, email: user.email, firstName: user.firstName, token: rawToken },
          tx,
        );
      });
    } catch (err) {
     
      if (err instanceof EmailAlreadyExistsError) {
        throw new AppException(
          UserErrorCode.EMAIL_ALREADY_IN_USE,
          { field: "email" },
          HttpStatus.CONFLICT,
        );
      }

      if (err instanceof UsernameAlreadyTakenError) {
        throw new AppException(
          UserErrorCode.USERNAME_ALREADY_TAKEN,
          { field: "username" },
          HttpStatus.CONFLICT,
        );
      }

      throw err;
    }

    return user;
  }
}