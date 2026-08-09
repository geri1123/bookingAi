// mail/handlers/send-password-reset-requested-email.handler.ts
import { Injectable } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { PasswordResetEmailPayload } from "../../domain/types/email-job.types";
import { buildPasswordResetRequestedEmailHtml } from "../templates/password-reset-requested-email.template";

@Injectable()
export class SendPasswordResetRequestedEmailHandler {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: PasswordResetEmailPayload): Promise<void> {
    if (!payload.email) {
      return;
    }

    const resetUrl = `${this.config.clientBaseUrl}/reset-password?token=${payload.token}`;

    const html = buildPasswordResetRequestedEmailHtml({
      firstName: payload.firstName ?? "atje",
      resetUrl,
    });

    await this.emailSender.send({
      to: payload.email,
      subject: "Rivendos fjalëkalimin tuaj",
      html,
    });
  }
}