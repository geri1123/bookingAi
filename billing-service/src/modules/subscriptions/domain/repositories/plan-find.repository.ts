import { PlanEntity, PlanTier } from "../entities/plan.entity";

export abstract class PlanFindRepository {
  abstract findByTier(tier: PlanTier): Promise<PlanEntity | null>;
  abstract findById(id: string): Promise<PlanEntity | null>;
  abstract findAll(): Promise<PlanEntity[]>;
}
