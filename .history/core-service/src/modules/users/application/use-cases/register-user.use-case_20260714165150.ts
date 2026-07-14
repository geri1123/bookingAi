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
import { Prisma } from "@prisma/client";

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
    private readonly prisma: PrismaService, // vetëm për $transaction, jo për query direkt
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
          field: "password"
        },
        HttpStatus.BAD_REQUEST
      );

    }
    const [emailTaken, usernameTaken] = await Promise.all([
      this.userFindRepo.existsByEmail(input.email),
      this.userFindRepo.existsByUsername(input.username),
    ]);

     if (emailTaken) {

      throw new AppException(
        UserErrorCode.EMAIL_ALREADY_IN_USE,
        {
          field:"email"
        },
        HttpStatus.CONFLICT
      );

    }


    if (usernameTaken) {

      throw new AppException(
        UserErrorCode.USERNAME_ALREADY_TAKEN,
        {
          field:"username"
        },
        HttpStatus.CONFLICT
      );

    }

    const hashedPassword = await this.passwordHasher.hash(input.password);
    const user = UserEntity.create({ ...input, password: hashedPassword });
    const rawToken = this.tokenGenerator.generate();
    const verificationToken = VerificationTokenEntity.create(user.id, rawToken, TokenType.EMAIL_VERIFICATION);

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
      // Race condition: dy requests njekohesisht me te njejtin email/username.
      // Kontrollet e mesiperme (existsByEmail/existsByUsername) mund t'i lene te kalojne
      // te dyja nese vijne ne te njejten kohe, prandaj DB unique constraint eshte "safety net".
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined)?.join(",") ?? "";
        const isEmail = target.includes("email");

        throw new AppException(
          isEmail ? UserErrorCode.EMAIL_ALREADY_IN_USE : UserErrorCode.USERNAME_ALREADY_TAKEN,
          { field: isEmail ? "email" : "username" },
          HttpStatus.CONFLICT,
        );
      }

      throw err;
    }

    return user;
  }
}