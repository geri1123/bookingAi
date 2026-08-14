import { Plan as PrismaPlan } from "../../../../generated/prisma-client";
import { PlanEntity, PlanTier } from "../../domain/entities/plan.entity";

export class PlanMapper {
  static toDomain(raw: PrismaPlan): PlanEntity {
    return PlanEntity.reconstitute({
      id: raw.id,
      tier: raw.tier as PlanTier,
      name: raw.name,
      priceCents: raw.priceCents,
      messageLimit: raw.messageLimit,
      durationDays: raw.durationDays,
      createdAt: raw.createdAt,
    });
  }
}
