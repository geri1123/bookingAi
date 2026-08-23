import { Injectable, HttpStatus } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionErrorCode } from "../../domain/errors/subscription-error-codes.enum";

@Injectable()
export class CancelSubscriptionUseCase {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
  ) {}

  async execute(businessId: string): Promise<void> {
    const subscription = await this.subscriptionFindRepo.findByBusinessId(businessId);
    if (!subscription) {
      throw new AppException(
        SubscriptionErrorCode.SUBSCRIPTION_NOT_FOUND,
        { field: "businessId" },
        HttpStatus.NOT_FOUND,
      );
    }
    if (subscription.paymentProvider !== "paddle" || !subscription.externalReference) {
      throw new AppException(
        SubscriptionErrorCode.NOT_LINKED_TO_PADDLE,
        { field: "_general" },
        HttpStatus.BAD_REQUEST,
      );
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
      throw new AppException(
        SubscriptionErrorCode.PADDLE_CANCEL_FAILED,
        { field: "_general", paddleError: errBody },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}