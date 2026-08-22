import { Injectable, BadRequestException } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { PlanFindRepository } from "../../domain/repositories/plan-find.repository";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { PlanTier } from "../../domain/entities/plan.entity";

export interface UpgradeCheckoutResult {
  requiresCheckout: boolean;
  checkoutUrl: string | null;
  transactionId: string | null;
  message: string;
}

@Injectable()
export class CreateUpgradeCheckoutUseCase {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly planFindRepo: PlanFindRepository,
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
  ) {}

  async execute(businessId: string, targetTier: PlanTier): Promise<UpgradeCheckoutResult> {
    if (targetTier === PlanTier.FREE) {
      throw new BadRequestException("S'mund te krijosh checkout per planin FREE.");
    }

    const plan = await this.planFindRepo.findByTier(targetTier);
    if (!plan || !plan.paddlePriceId) {
      throw new BadRequestException(`Plani ${targetTier} s'ka paddle_price_id te konfiguruar.`);
    }

    const subscription = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (!subscription) {
      throw new BadRequestException("S'u gjet subscription per kete biznes.");
    }

    if (subscription.paymentProvider === "paddle" && subscription.externalReference) {
      await this.updateExistingPaddleSubscription(subscription.externalReference, plan.paddlePriceId);
      return {
        requiresCheckout: false,
        checkoutUrl: null,
        transactionId: null,
        message: `Plani u ndryshua ne ${targetTier} direkt - s'ka nevoje per pagese te re, Paddle e llogarit vete diferencen.`,
      };
    }

    const response = await fetch(`${this.appConfig.paddleApiBaseUrl}/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.appConfig.paddleApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [{ price_id: plan.paddlePriceId, quantity: 1 }],
        custom_data: { businessId },
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new BadRequestException(`Paddle refuzoi krijimin e checkout-it: ${errBody}`);
    }

    const data = (await response.json()) as {
      data: { id: string; checkout: { url: string } };
    };

    return {
      requiresCheckout: true,
      checkoutUrl: data.data.checkout.url,
      transactionId: data.data.id,
      message: "Checkout u krijua - klienti duhet te paguaje.",
    };
  }

  private async updateExistingPaddleSubscription(paddleSubscriptionId: string, newPriceId: string): Promise<void> {
    const response = await fetch(
      `${this.appConfig.paddleApiBaseUrl}/subscriptions/${paddleSubscriptionId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.appConfig.paddleApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ price_id: newPriceId, quantity: 1 }],
          proration_billing_mode: "prorated_immediately",
        }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new BadRequestException(`Paddle refuzoi ndryshimin e planit: ${errBody}`);
    }
  }
}