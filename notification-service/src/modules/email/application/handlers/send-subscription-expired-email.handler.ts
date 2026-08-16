import { Injectable, Logger } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionExpiredPayload } from "../../domain/types/email-job.types";
import { buildSubscriptionExpiredEmailHtml } from "../templates/subscription-expired-email.template";

@Injectable()
export class SendSubscriptionExpiredEmailHandler {
  private readonly logger = new Logger(SendSubscriptionExpiredEmailHandler.name);

  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: SubscriptionExpiredPayload): Promise<void> {
    if (!payload.ownerEmail) {
      this.logger.warn(`S'ka ownerEmail per biznesin ${payload.businessId} — email i anashkaluar.`);
      return;
    }

    const html = buildSubscriptionExpiredEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.businessName ?? "biznesi juaj",
      billingUrl: `${this.config.clientBaseUrl}/dashboard/billing`,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `Abonimi ka skaduar — ${payload.businessName ?? ""}`,
      html,
    });
  }
}