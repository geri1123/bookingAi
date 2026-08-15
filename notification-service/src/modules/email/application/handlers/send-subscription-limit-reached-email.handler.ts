import { Injectable, Logger } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionLimitReachedPayload } from "../../domain/types/email-job.types";
import { buildSubscriptionLimitReachedEmailHtml } from "../templates/subscription-limit-reached-email.template";

@Injectable()
export class SendSubscriptionLimitReachedEmailHandler {
  private readonly logger = new Logger(SendSubscriptionLimitReachedEmailHandler.name);

  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: SubscriptionLimitReachedPayload): Promise<void> {
    if (!payload.ownerEmail) {
      this.logger.warn(`S'ka ownerEmail per biznesin ${payload.businessId} — email i anashkaluar.`);
      return;
    }

    const html = buildSubscriptionLimitReachedEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.businessName ?? "biznesi juaj",
      messageCount: payload.messageCount,
      messageLimit: payload.messageLimit,
      billingUrl: `${this.config.clientBaseUrl}/dashboard/billing`,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `Limiti i mesazheve AI u arrit — ${payload.businessName ?? ""}`,
      html,
    });
  }
}