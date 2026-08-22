import { Injectable, BadRequestException } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";

@Injectable()
export class CancelSubscriptionUseCase {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
  ) {}

  async execute(businessId: string): Promise<void> {
    const subscription = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (!subscription) {
      throw new BadRequestException("S'u gjet subscription per kete biznes.");
    }
    if (subscription.paymentProvider !== "paddle" || !subscription.externalReference) {
      throw new BadRequestException("Ky abonim s'eshte i lidhur me Paddle (mund te jete plan FREE).");
    }

    const response = await fetch(
      `${this.appConfig.paddleApiBaseUrl}/subscriptions/${subscription.externalReference}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.appConfig.paddleApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ effective_from: "next_billing_period" }),
      },
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new BadRequestException(`Paddle refuzoi anulimin: ${errBody}`);
    }
  }
}