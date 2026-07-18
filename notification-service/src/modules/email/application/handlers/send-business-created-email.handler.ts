import { Injectable } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { BusinessCreatedPayload } from "../../domain/types/email-job.types";
import { buildBusinessCreatedEmailHtml } from "../templates/business-created-email.template";

@Injectable()
export class SendBusinessCreatedEmailHandler {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: BusinessCreatedPayload): Promise<void> {
    if (!payload.ownerEmail) {
      return;
    }

    const dashboardUrl = `${this.config.clientBaseUrl}/dashboard`;

    const html = buildBusinessCreatedEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.name,
      dashboardUrl,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `${payload.name} u krijua me sukses!`,
      html,
    });
  }
}