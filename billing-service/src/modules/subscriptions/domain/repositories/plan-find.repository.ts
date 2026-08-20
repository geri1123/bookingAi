import { PlanEntity, PlanTier } from "../entities/plan.entity";

export abstract class PlanFindRepository {
  abstract findByTier(tier: PlanTier): Promise<PlanEntity | null>;
  abstract findById(id: string): Promise<PlanEntity | null>;
  abstract findAll(): Promise<PlanEntity[]>;

  // Perdoret nga webhook-u i Paddle: eventet permbajne vetem price_id te
  // Paddle-s, jo planId-n tone intern.
  abstract findByPaddlePriceId(paddlePriceId: string): Promise<PlanEntity | null>;
}
