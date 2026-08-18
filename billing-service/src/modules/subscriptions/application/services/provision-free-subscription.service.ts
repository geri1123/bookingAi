import { Injectable, Logger } from "@nestjs/common";
import { Prisma } from "../../../../generated/prisma-client";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { PlanTier } from "../../domain/entities/plan.entity";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

const PRISMA_UNIQUE_CONSTRAINT_VIOLATION = "P2002";

@Injectable()
export class ProvisionFreeSubscriptionService {
  private readonly logger = new Logger(ProvisionFreeSubscriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly planFindRepo: PlanFindRepository,
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  // Idempotent ne 2 nivele:
  
  async provision(businessId: string): Promise<void> {
    const existing = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (existing) {
      return;
    }

    const freePlan = await this.planFindRepo.findByTier(PlanTier.FREE);
    if (!freePlan) {
      this.logger.error("Plani FREE s'ekziston ne DB — xhiro seed-in e planeve.");
      return;
    }

    const subscription = SubscriptionEntity.createFree({
      businessId,
      planId: freePlan.id,
      durationDays: freePlan.durationDays,
    });

    try {
      await this.prisma.$transaction(async (tx) => {
        await this.subscriptionWriteRepo.create(subscription, tx);

        await this.outboxWriter.write(
          EventName.SUBSCRIPTION_CREATED,
          businessId,
          {
            businessId,
            planTier: freePlan.tier,
            currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
          },
          tx,
        );
      });

      this.logger.log(`Subscription FREE u krijua per biznesin ${businessId}`);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === PRISMA_UNIQUE_CONSTRAINT_VIOLATION) {
        this.logger.warn(`Subscription per biznesin ${businessId} u krijua tashme konkurrentisht — injorohet.`);
        return;
      }
      throw err;
    }
  }
}
