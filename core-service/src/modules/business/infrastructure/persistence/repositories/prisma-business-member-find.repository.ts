import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessMemberFindRepository } from "../../../domain/repositories/business-member-find.repository";
import { MembershipSummary } from "../../../domain/read-models/membership-summary";
import { BusinessMemberEntity } from "../../../domain/entities/business-member.entity";
import { BusinessMemberMapper } from "../mappers/business-member.mapper";

@Injectable()
export class PrismaBusinessMemberFindRepository implements BusinessMemberFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<MembershipSummary[]> {
    const rows = await this.prisma.businessMember.findMany({
      where: { userId },
      include: { business: { select: { name: true } } },
    });
    return rows.map((row) => ({
      businessId: row.businessId,
      businessName: row.business.name,
      role: row.role as MembershipSummary["role"],
    }));
  }

  async isMember(userId: string, businessId: string): Promise<boolean> {
    const count = await this.prisma.businessMember.count({ where: { userId, businessId } });
    return count > 0;
  }

  async findMembership(userId: string, businessId: string): Promise<MembershipSummary | null> {
    const row = await this.prisma.businessMember.findFirst({
      where: { userId, businessId },
      include: { business: { select: { name: true } } },
    });
    if (!row) return null;
    return {
      businessId: row.businessId,
      businessName: row.business.name,
      role: row.role as MembershipSummary["role"],
    };
  }
  async findOwner(businessId: string): Promise<BusinessMemberEntity | null> {
  const row = await this.prisma.businessMember.findFirst({ where: { businessId, role: "OWNER" } });
  return row ? BusinessMemberMapper.toDomain(row) : null;
}
}