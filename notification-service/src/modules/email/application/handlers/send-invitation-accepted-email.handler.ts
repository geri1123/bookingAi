import { Injectable } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { InvitationAcceptedPayload } from "../../domain/types/email-job.types";
import { buildInvitationAcceptedEmailHtml } from "../templates/invitation-accepted-email.template";

@Injectable()
export class SendInvitationAcceptedEmailHandler {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: InvitationAcceptedPayload): Promise<void> {
    if (!payload.inviterEmail) {
      return;
    }

    const businessUrl = `${this.config.clientBaseUrl}/business/${payload.businessId}/team`;

    const html = buildInvitationAcceptedEmailHtml({
      inviterFirstName: payload.inviterFirstName ?? "Dikush",
      newMemberFirstName: payload.newMemberFirstName,
      newMemberEmail: payload.newMemberEmail,
      businessName: payload.businessName ?? "biznesi",
      role: payload.role,
      businessUrl,
    });

    await this.emailSender.send({
      to: payload.inviterEmail,
      subject: `${payload.newMemberFirstName} pranoi ftesën tënde`,
      html,
    });
  }
}