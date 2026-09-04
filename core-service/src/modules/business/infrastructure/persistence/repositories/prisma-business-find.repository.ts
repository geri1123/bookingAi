import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessFindRepository } from "../../../domain/repositories/business-find.repository";
import { BusinessEntity } from "../../../domain/entities/business.entity";
import { BusinessMapper } from "../mappers/business.mapper";
import { BusinessCacheService } from "../cache/business-cache.service";

@Injectable()
export class PrismaBusinessFindRepository implements BusinessFindRepository {
  
  private readonly inflight = new Map<string, Promise<BusinessEntity | null>>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: BusinessCacheService,
  ) {}

  async findById(id: string): Promise<BusinessEntity | null> {
    
    const existing = this.inflight.get(id);
    if (existing) {
      return existing;
    }

    const promise = this.loadWithCache(id).finally(() => {
      this.inflight.delete(id);
    });
    this.inflight.set(id, promise);
    return promise;
  }

  private async loadWithCache(id: string): Promise<BusinessEntity | null> {
    const cached = await this.cache.get(id);
    if (cached) {
      return BusinessMapper.toDomain(cached);
    }

    const raw = await this.prisma.business.findUnique({ where: { id } });
    if (!raw) return null;

    await this.cache.set(raw);
    return BusinessMapper.toDomain(raw);
  }

  async findByEmail(email: string): Promise<BusinessEntity | null> {
    const raw = await this.prisma.business.findUnique({ where: { email } });
    return raw ? BusinessMapper.toDomain(raw) : null;
  }

  async findStalePendingSetupPage(olderThan: Date, take: number, cursorId?: string): Promise<BusinessEntity[]> {
    const rows = await this.prisma.business.findMany({
      where: { status: "PENDING_SETUP", createdAt: { lt: olderThan }, setupReminderSentAt: null },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }], 
      take,
      ...(cursorId
        ? {
            cursor: { id: cursorId },
            skip: 1, 
          }
        : {}),
    });
    return rows.map(BusinessMapper.toDomain);
  }
}