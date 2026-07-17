import { HttpStatus, Injectable } from "@nestjs/common";
import { BusinessMemberFindRepository } from "../../../business/domain/repositories/business-member-find.repository";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../users/domain/errors/user-error-codes.enum";
import { TokenService, IssuedTokens } from "../../domain/services/token.service";

export interface SelectBusinessInput {
  userId: string;
  businessId: string;
  rememberMe: boolean;
}

@Injectable()
export class SelectBusinessUseCase {
  constructor(
    private readonly businessMemberFindRepo: BusinessMemberFindRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: SelectBusinessInput): Promise<IssuedTokens> {
    const membership = await this.businessMemberFindRepo.findMembership(input.userId, input.businessId);

    if (!membership) {
      throw new AppException(UserErrorCode.USER_NOT_FOUND, { field: "businessId" }, HttpStatus.FORBIDDEN);
    }

    return this.tokenService.issueFullToken({
      userId: input.userId,
      businessId: membership.businessId,
      role: membership.role,
      rememberMe: input.rememberMe,
    });
  }
}