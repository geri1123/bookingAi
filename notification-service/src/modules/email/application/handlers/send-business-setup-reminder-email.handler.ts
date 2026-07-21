// mail/handlers/send-business-setup-reminder-email.handler.ts
import { Injectable } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { BusinessSetupReminderPayload } from "../../domain/types/email-job.types";
import { buildBusinessSetupReminderEmailHtml } from "../templates/business-setup-reminder-email.template";

const STEP_LABELS: Record<string, string> = {
  SERVICE: "Shto të paktën 1 shërbim",
  EMPLOYEE: "Shto të paktën 1 punonjës",
  SCHEDULE: "Vendos orarin e punonjësve",
};

@Injectable()
export class SendBusinessSetupReminderEmailHandler {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: BusinessSetupReminderPayload): Promise<void> {
    if (!payload.ownerEmail || payload.missingSteps.length === 0) {
      return;
    }

    const missingStepsLabels = payload.missingSteps.map((step) => STEP_LABELS[step] ?? step);
    const dashboardUrl = `${this.config.clientBaseUrl}/dashboard`;

    const html = buildBusinessSetupReminderEmailHtml({
      ownerFirstName: payload.ownerFirstName ?? "atje",
      businessName: payload.businessName,
      missingStepsLabels,
      dashboardUrl,
    });

    await this.emailSender.send({
      to: payload.ownerEmail,
      subject: `Përfundo konfigurimin e ${payload.businessName}`,
      html,
    });
  }
}