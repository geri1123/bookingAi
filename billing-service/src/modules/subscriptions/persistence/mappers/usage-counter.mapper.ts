import { UsageCounter as PrismaUsageCounter } from "../../../../generated/prisma-client";
import { UsageCounterEntity } from "../../domain/entities/usage-counter.entity";

export class UsageCounterMapper {
  static toDomain(raw: PrismaUsageCounter): UsageCounterEntity {
    return UsageCounterEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      periodStart: raw.periodStart,
      periodEnd: raw.periodEnd,
      messageCount: raw.messageCount,
    });
  }
}
