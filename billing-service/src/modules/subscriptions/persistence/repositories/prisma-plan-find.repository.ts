import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { PlanEntity ,PlanTier } from "../../domain/entities/plan.entity";
import { PlanMapper } from "../mappers/plan.mapper";

@Injectable()
export class PrismaPlanFindRepository implements PlanFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTier(tier: PlanTier): Promise<PlanEntity | null> {
    const row = await this.prisma.plan.findUnique({ where: { tier } });
    return row ? PlanMapper.toDomain(row) : null;
  }

  async findById(id: string): Promise<PlanEntity | null> {
    const row = await this.prisma.plan.findUnique({ where: { id } });
    return row ? PlanMapper.toDomain(row) : null;
  }

  async findAll(): Promise<PlanEntity[]> {
    const rows = await this.prisma.plan.findMany({ orderBy: { priceCents: "asc" } });
    return rows.map(PlanMapper.toDomain);
  }

  async findByPaddlePriceId(paddlePriceId: string): Promise<PlanEntity | null> {
    const row = await this.prisma.plan.findUnique({ where: { paddlePriceId } });
    return row ? PlanMapper.toDomain(row) : null;
  }
}
