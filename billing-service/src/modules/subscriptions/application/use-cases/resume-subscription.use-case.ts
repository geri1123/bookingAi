import { Injectable, HttpStatus } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionFindRepository } from "../../domain/repositories/subscription-find.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionErrorCode } from "../../domain/errors/subscription-error-codes.enum";

// E kunderta e CancelSubscriptionUseCase: heq nje anulim te planifikuar
// (autoRenew: false -> true), pra biznesi shtyp butonin "Auto-renew: ON"
// pasi me pare e kishte fikur. Nuk krijon pagese te re - thjesht i thote
// Paddle "mos e anulo me ne fund te periudhes".
@Injectable()
export class ResumeSubscriptionUseCase {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly subscriptionFindRepo: SubscriptionFindRepository,
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
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

    // scheduled_change: null = hiq anulimin e planifikuar te Paddle.
    // (referenca: Paddle "Update a subscription" - fusha scheduled_change,
    // vendos null per te hequr nje ndryshim te planifikuar ekzistues).
    const response = await fetch(`${this.appConfig.paddleApiBaseUrl}/subscriptions/${subscription.externalReference}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${this.appConfig.paddleApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scheduled_change: null }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new AppException(
        SubscriptionErrorCode.PADDLE_RESUME_FAILED,
        { field: "_general", paddleError: errBody },
        HttpStatus.BAD_GATEWAY,
      );
    }

    subscription.resume();
    await this.subscriptionWriteRepo.update(subscription);
  }
}
