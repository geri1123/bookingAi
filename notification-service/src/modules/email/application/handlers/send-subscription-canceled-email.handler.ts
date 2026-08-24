import { Injectable, Logger } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionCanceledPayload } from "../../domain/types/email-job.types";
import { buildSubscriptionCanceledEmailHtml } from "../templates/subscription-canceled-email.template";

@Injectable()
export class SendSubscriptionCanceledEmailHandler {
  private readonly logger = new Logger(SendSubscriptionCanceledEmailHandler.name);

  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: SubscriptionCanceledPayload): Promise<void> {
    if (!payload.ownerEmail) {
      this.logger.warn(`S'ka ownerEmail per biznesin ${payload.businessId} — email i anashkaluar.`);
      return;
    }

    const html = buildSubscriptionCanceledEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.businessName ?? "biznesi juaj",
      billingUrl: `${this.config.clientBaseUrl}/dashboard/billing`,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `Kaluat ne planin Falas — ${payload.businessName ?? ""}`,
      html,
    });
  }
}