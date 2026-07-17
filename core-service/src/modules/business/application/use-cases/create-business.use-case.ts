import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { BusinessEntity, BusinessType, BusinessLanguage } from "../../domain/entities/business.entity";
import { BusinessMemberEntity, BusinessMemberRole } from "../../domain/entities/business-member.entity";
import { BusinessCreateRepository } from "../../domain/repositories/business-create.repository";
import { BusinessMemberCreateRepository } from "../../domain/repositories/business-member-create.repository";
import { TokenService, IssuedTokens } from "../../../auth/domain/services/token.service";

export interface CreateBusinessInput {
  userId: string;
  rememberMe: boolean;
  name: string;
  type: BusinessType;
  language: BusinessLanguage;
  phone?: string;
  email?: string;
  address?: string;
}

export interface CreateBusinessOutput {
  businessId: string;
  tokens: IssuedTokens;
}

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessCreateRepo: BusinessCreateRepository,
    private readonly businessMemberCreateRepo: BusinessMemberCreateRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: CreateBusinessInput): Promise<CreateBusinessOutput> {
    const business = BusinessEntity.create({
      name: input.name,
      type: input.type,
      language: input.language,
      phone: input.phone,
      email: input.email,
      address: input.address,
    });

    const member = BusinessMemberEntity.create(input.userId, business.id, BusinessMemberRole.OWNER);

    await this.prisma.$transaction(async (tx) => {
      await this.businessCreateRepo.create(business, tx);
      await this.businessMemberCreateRepo.create(member, tx);
    });

    const tokens = await this.tokenService.issueFullToken({
      userId: input.userId,
      businessId: business.id,
      role: BusinessMemberRole.OWNER,
      rememberMe: input.rememberMe,
    });

    return { businessId: business.id, tokens };
  }
}