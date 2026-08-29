import { HttpStatus, Injectable } from "@nestjs/common";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { PasswordHasher } from "../../../users/domain/services/password-hasher";
import { UserStatus } from "../../../users/domain/enums/user-status.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { AuthenticateUserService, AuthenticateUserOutput } from "../services/authenticate-user.service";

export interface LoginInput {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export type LoginOutput = AuthenticateUserOutput;

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userFindRepo: UserFindRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly authenticateUser: AuthenticateUserService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const rememberMe = input.rememberMe ?? false;

    const user = await this.userFindRepo.findByIdentifier(input.identifier);
    if (!user) {
      throw new AppException(UserErrorCode.INVALID_CREDENTIALS, { field: "identifier" }, HttpStatus.UNAUTHORIZED);
    }

    const passwordMatches = await user.verifyPassword(input.password, this.passwordHasher);
    if (!passwordMatches) {
      throw new AppException(UserErrorCode.INVALID_CREDENTIALS, { field: "identifier" }, HttpStatus.UNAUTHORIZED);
    }

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      throw new AppException(UserErrorCode.EMAIL_NOT_VERIFIED, { field: "identifier" }, HttpStatus.FORBIDDEN);
    }
    if (user.status === UserStatus.SUSPENDED) {
      throw new AppException(UserErrorCode.ACCOUNT_SUSPENDED, { field: "identifier" }, HttpStatus.FORBIDDEN);
    }
    if (user.status === UserStatus.DELETED) {
      throw new AppException(UserErrorCode.INVALID_CREDENTIALS, { field: "identifier" }, HttpStatus.UNAUTHORIZED);
    }

    return this.authenticateUser.execute(user, rememberMe);
  }
}