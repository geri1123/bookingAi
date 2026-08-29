import { Injectable } from "@nestjs/common";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { UserUpdateRepository } from "../../../users/domain/repositories/user-update.repository";
import { UserEntity } from "../../../users/domain/entities/user.entity";
import { TokenService, IssuedTokens } from "../../domain/services/token.service";

export interface AuthenticateUserOutput {
  requiresBusinessSelection: boolean;
  hasNoBusiness: boolean;
  tokens: IssuedTokens;
  businesses?: { id: string; name: string; role: string }[];
}


@Injectable()
export class AuthenticateUserService {
  constructor(
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly tokenService: TokenService,
    private readonly userUpdateRepo: UserUpdateRepository,
  ) {}

  async execute(user: UserEntity, rememberMe: boolean): Promise<AuthenticateUserOutput> {
    user.recordLogin();
    await this.userUpdateRepo.update(user.id, { lastLoginAt: user.lastLoginAt });

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