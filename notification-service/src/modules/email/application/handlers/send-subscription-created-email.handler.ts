import { Injectable, Logger } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { SubscriptionCreatedPayload } from "../../domain/types/email-job.types";
import { buildSubscriptionCreatedEmailHtml } from "../templates/subscription-created-email.template";

@Injectable()
export class SendSubscriptionCreatedEmailHandler {
  private readonly logger = new Logger(SendSubscriptionCreatedEmailHandler.name);

  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: SubscriptionCreatedPayload): Promise<void> {
    if (!payload.ownerEmail) {
      this.logger.warn(`S'ka ownerEmail per biznesin ${payload.businessId} — email i anashkaluar.`);
      return;
    }

    const html = buildSubscriptionCreatedEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.businessName ?? "biznesi juaj",
      planName: payload.planName,
      messageLimit: payload.messageLimit,
      dashboardUrl: `${this.config.clientBaseUrl}/dashboard/billing`,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `Abonimi ${payload.planName} u aktivizua — ${payload.businessName ?? ""}`,
      html,
    });
  }
}