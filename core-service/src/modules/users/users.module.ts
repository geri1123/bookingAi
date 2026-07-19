import { Module } from "@nestjs/common";
import { UserCreateRepository } from "./domain/repositories/user-create.repository";
import { PrismaUserCreateRepository } from "./infrastructure/persistence/repositories/prisma-user-create.repository";
import { PrismaUserFindRepository } from "./infrastructure/persistence/repositories/prisma-user-find.repository";
import { UserFindRepository } from "./domain/repositories/user-find.repository";
import { PasswordHasher } from "./domain/services/password-hasher";
import { BcryptPasswordHasher } from "./infrastructure/security/bcrypt-password-hasher";
import { VerificationTokenRepository } from "./domain/repositories/verification-token.repository";
import { PrismaVerificationTokenRepository } from "./infrastructure/persistence/repositories/prisma-verification-token.repository";
import { TokenGenerator } from "./domain/services/token-generator";
import { CryptoTokenGenerator } from "./infrastructure/security/crypto-token-generator";
import { RegisterUserUseCase } from "./application/use-cases/register-user.use-case";
import { UserAuthController } from "./presentation/controllers/user-auth.controller";
import { VerifyEmailUseCase } from "./application/use-cases/verify-email.use-case";
import { UserUpdateRepository } from "./domain/repositories/user-update.repository";
import { PrismaUserUpdateRepository } from "./infrastructure/persistence/repositories/prisma-user-update.repository";
import { ResendVerificationUseCase } from "./application/use-cases/resend-verification.use-case";
// import { UsersController } from "./presentation/controllers/users.controller";

@Module({
  controllers: [UserAuthController],
  providers: [
    { provide: UserCreateRepository, useClass: PrismaUserCreateRepository },
    { provide: UserFindRepository, useClass: PrismaUserFindRepository },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    {provide:UserUpdateRepository , useClass:PrismaUserUpdateRepository},
    { provide: VerificationTokenRepository, useClass: PrismaVerificationTokenRepository },
    { provide: TokenGenerator, useClass: CryptoTokenGenerator },
    ResendVerificationUseCase,
    RegisterUserUseCase,
    VerifyEmailUseCase,
  ],
  exports: [UserFindRepository,UserUpdateRepository, PasswordHasher, UserCreateRepository , TokenGenerator],
})
export class UsersModule {}