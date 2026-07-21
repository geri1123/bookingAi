// mail/handlers/send-business-activated-email.handler.ts
import { Injectable } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { BusinessActivatedPayload } from "../../domain/types/email-job.types";
import { buildBusinessActivatedEmailHtml } from "../templates/business-activated-email.template";

@Injectable()
export class SendBusinessActivatedEmailHandler {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: BusinessActivatedPayload): Promise<void> {
    if (!payload.ownerEmail) {
      return;
    }

    const dashboardUrl = `${this.config.clientBaseUrl}/dashboard`;

    const html = buildBusinessActivatedEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.businessName,
      dashboardUrl,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `${payload.businessName} është gati për klientë!`,
      html,
    });
  }
}