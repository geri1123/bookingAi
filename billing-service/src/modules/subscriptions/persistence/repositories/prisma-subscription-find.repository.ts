import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionMapper } from "../mappers/subscription.mapper";

@Injectable()
export class PrismaSubscriptionFindRepository implements SubscriptionFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByBusinessId(businessId: string): Promise<SubscriptionEntity | null> {
    const row = await this.prisma.subscription.findUnique({ where: { businessId } });
    return row ? SubscriptionMapper.toDomain(row) : null;
  }

  async findActiveExpiringBefore(date: Date): Promise<SubscriptionEntity[]> {
    const rows = await this.prisma.subscription.findMany({
      where: { status: "ACTIVE", currentPeriodEnd: { lt: date } },
    });
    return rows.map(SubscriptionMapper.toDomain);
  }
}
