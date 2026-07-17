import { HttpStatus, Injectable } from "@nestjs/common";
import { UserFindRepository } from "../../../users/domain/repositories/user-find.repository";
import { PasswordHasher } from "../../../users/domain/services/password-hasher";
import { UserStatus } from "../../../users/domain/enums/user-status.enum";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { TokenService, IssuedTokens } from "../../domain/services/token.service";

export interface LoginInput {
  identifier: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginOutput {
  requiresBusinessSelection: boolean;
  hasNoBusiness: boolean;
  tokens: IssuedTokens;
  businesses?: { id: string; name: string; role: string }[];
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userFindRepo: UserFindRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly tokenService: TokenService,
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

    const memberships = await this.businessMemberFindRepo.findByUserId(user.id);

    if (memberships.length === 0) {
      const tokens = await this.tokenService.issuePreAuthToken(user.id, rememberMe);
      return { requiresBusinessSelection: false, hasNoBusiness: true, tokens };
    }

    if (memberships.length === 1) {
      const member = memberships[0];
      const tokens = await this.tokenService.issueFullToken({
        userId: user.id,
        businessId: member.businessId,
        role: member.role,
        rememberMe,
      });
      return { requiresBusinessSelection: false, hasNoBusiness: false, tokens };
    }

    const tokens = await this.tokenService.issuePreAuthToken(user.id, rememberMe);
    return {
      requiresBusinessSelection: true,
      hasNoBusiness: false,
      tokens,
      businesses: memberships.map((m) => ({ id: m.businessId, name: m.businessName, role: m.role })),
    };
  }
}