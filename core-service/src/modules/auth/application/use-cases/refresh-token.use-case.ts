import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { IssuedTokens, TokenService } from "../../domain/services/token.service";

export interface RefreshTokenOutput {
  tokens: IssuedTokens;
  rememberMe: boolean;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(refreshToken: string): Promise<RefreshTokenOutput> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    if (!payload.businessId) {
      const tokens = await this.tokenService.issuePreAuthToken(payload.sub, payload.rememberMe);
      return { tokens, rememberMe: payload.rememberMe };
    }

    const membership = await this.businessMemberFindRepo.findMembership(payload.sub, payload.businessId);

    if (!membership) {
      throw new AppException(UserErrorCode.USER_NOT_FOUND, { field: "businessId" }, HttpStatus.FORBIDDEN);
    }

    const tokens = await this.tokenService.issueFullToken({
      userId: payload.sub,
      businessId: membership.businessId,
      role: membership.role,
      rememberMe: payload.rememberMe,
    });

    return { tokens, rememberMe: payload.rememberMe };
  }
}