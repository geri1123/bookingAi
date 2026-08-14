import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";

import { UsageCounterEntity } from "../../domain/entities/usage-counter.entity";
import { UsageCounterMapper } from "../mappers/usage-counter.mapper";
import { IncrementUsageParams, IncrementUsageResult, UsageCounterRepository } from "../../domain/repositories/usage-counter.repository";

interface CounterRow {
  message_count: number;
}

@Injectable()
export class PrismaUsageCounterRepository implements UsageCounterRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByBusinessAndPeriod(businessId: string, periodStart: Date): Promise<UsageCounterEntity | null> {
    const row = await this.prisma.usageCounter.findUnique({
      where: { businessId_periodStart: { businessId, periodStart } },
    });
    return row ? UsageCounterMapper.toDomain(row) : null;
  }

  
  async incrementIfAllowed(params: IncrementUsageParams): Promise<IncrementUsageResult> {
    const id = randomUUID();

    if (params.messageLimit === null) {
      const rows = await this.prisma.$queryRaw<CounterRow[]>`
        INSERT INTO usage_counters (id, business_id, period_start, period_end, message_count)
        VALUES (${id}, ${params.businessId}, ${params.periodStart}, ${params.periodEnd}, 1)
        ON CONFLICT (business_id, period_start)
        DO UPDATE SET message_count = usage_counters.message_count + 1
        RETURNING message_count
      `;
      return { allowed: true, messageCount: rows[0].message_count };
    }

    const rows = await this.prisma.$queryRaw<CounterRow[]>`
      INSERT INTO usage_counters (id, business_id, period_start, period_end, message_count)
      VALUES (${id}, ${params.businessId}, ${params.periodStart}, ${params.periodEnd}, 1)
      ON CONFLICT (business_id, period_start)
      DO UPDATE SET message_count = usage_counters.message_count + 1
      WHERE usage_counters.message_count < ${params.messageLimit}
      RETURNING message_count
    `;

    if (rows.length === 0) {
      const current = await this.findByBusinessAndPeriod(params.businessId, params.periodStart);
      return { allowed: false, messageCount: current?.messageCount ?? params.messageLimit };
    }

    return { allowed: true, messageCount: rows[0].message_count };
  }
}
