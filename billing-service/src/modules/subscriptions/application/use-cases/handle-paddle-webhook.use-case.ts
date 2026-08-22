import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionNotificationService } from "../services/subscription-notification.service";

export interface PaddleWebhookEventPayload {
  event_id: string;
  event_type: string;
  data: {
    id: string;
    subscription_id?: string;
    customer_id?: string;
    status?: string;
    items?: { price?: { id?: string } }[];
    billing_period?: { starts_at?: string; ends_at?: string };
    custom_data?: { businessId?: string } | null;
  };
}

@Injectable()
export class HandlePaddleWebhookUseCase {
  private readonly logger = new Logger(HandlePaddleWebhookUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
    private readonly planFindRepo: PlanFindRepository,
    private readonly notificationService: SubscriptionNotificationService,
  ) {}

  async execute(payload: PaddleWebhookEventPayload): Promise<void> {
    try {
      await this.prisma.paddleWebhookEvent.create({
        data: { id: payload.event_id, eventType: payload.event_type },
      });
    } catch (err) {
      this.logger.log(`Event ${payload.event_id} tashme i perpunuar (idempotent skip).`);
      return;
    }

    const subscriptionId = payload.data.subscription_id ?? payload.data.id;

    switch (payload.event_type) {
      case "subscription.created":
        await this.handleSubscriptionCreated(subscriptionId, payload.data);
        break;
      case "subscription.updated":
        await this.handleSubscriptionUpdated(subscriptionId, payload.data);
        break;
      case "subscription.canceled":
        await this.handleSubscriptionCanceled(subscriptionId);
        break;
      case "transaction.completed":
        await this.handleTransactionCompleted(subscriptionId, payload.data);
        break;
      case "transaction.payment_failed":
        await this.handlePaymentFailed(subscriptionId);
        break;
      default:
        this.logger.log(`Event i papertrajtuar: ${payload.event_type} (injorohet, jo gabim).`);
    }
  }

  private async withLockedSubscription(
    externalReference: string,
    mutate: (sub: SubscriptionEntity) => void,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const row = await tx.$queryRaw<{ id: string }[]>`
        SELECT id FROM subscriptions WHERE external_reference = ${externalReference} FOR UPDATE
      `;
      if (row.length === 0) {
        this.logger.warn(`S'u gjet subscription per externalReference=${externalReference}`);
        return;
      }

      const subscription = await this.subscriptionFindRepo.findByExternalReference(externalReference);
      if (!subscription) return;

      mutate(subscription);
      await this.subscriptionWriteRepo.update(subscription, tx);
    });
  }

  private async handleSubscriptionCreated(
    paddleSubscriptionId: string,
    data: PaddleWebhookEventPayload["data"],
  ): Promise<void> {
    const businessId = data.custom_data?.businessId;
    if (!businessId) {
      this.logger.error(`subscription.created pa custom_data.businessId (paddleId=${paddleSubscriptionId})`);
      return;
    }

    const subscription = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (!subscription) {
      this.logger.error(`S'u gjet subscription lokale per businessId=${businessId}`);
      return;
    }

    const priceId = data.items?.[0]?.price?.id;
    const plan = priceId ? await this.planFindRepo.findByPaddlePriceId(priceId) : null;
    if (!plan) {
      this.logger.error(`S'u gjet plan lokal per Paddle price_id=${priceId}`);
      return;
    }

    const periodStart = data.billing_period?.starts_at ? new Date(data.billing_period.starts_at) : new Date();
    const periodEnd = data.billing_period?.ends_at
      ? new Date(data.billing_period.ends_at)
      : new Date(periodStart.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    subscription.changePlan(plan.id, periodStart, periodEnd);
    subscription.setPaymentReference("paddle", paddleSubscriptionId);
    await this.subscriptionWriteRepo.update(subscription);

    await this.notificationService.notifySubscriptionCreated(businessId, plan.name, plan.messageLimit);
  }

  private async handleSubscriptionUpdated(
    paddleSubscriptionId: string,
    data: PaddleWebhookEventPayload["data"],
  ): Promise<void> {
    const priceId = data.items?.[0]?.price?.id;
    const plan = priceId ? await this.planFindRepo.findByPaddlePriceId(priceId) : null;
    if (!plan) return;

    await this.withLockedSubscription(paddleSubscriptionId, (sub) => {
      const periodStart = data.billing_period?.starts_at ? new Date(data.billing_period.starts_at) : new Date();
      const periodEnd = data.billing_period?.ends_at
        ? new Date(data.billing_period.ends_at)
        : new Date(periodStart.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
      sub.changePlan(plan.id, periodStart, periodEnd);
    });
  }

  private async handleSubscriptionCanceled(paddleSubscriptionId: string): Promise<void> {
    await this.withLockedSubscription(paddleSubscriptionId, (sub) => sub.cancel());
  }

  private async handleTransactionCompleted(
    paddleSubscriptionId: string,
    data: PaddleWebhookEventPayload["data"],
  ): Promise<void> {
    await this.withLockedSubscription(paddleSubscriptionId, (sub) => {
      const periodStart = data.billing_period?.starts_at ? new Date(data.billing_period.starts_at) : new Date();
      const periodEnd =
        data.billing_period?.ends_at ??
        new Date(periodStart.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
      sub.renew(periodStart, new Date(periodEnd));
    });
  }

  private async handlePaymentFailed(paddleSubscriptionId: string): Promise<void> {
    await this.withLockedSubscription(paddleSubscriptionId, (sub) => sub.markPastDue());
  }
}