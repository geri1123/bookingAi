import { Injectable } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { AppConfigService } from "../../../../config/config.service";
import { InvitationSentPayload } from "../../domain/types/email-job.types";
import { buildInvitationEmailHtml } from "../templates/invite.template";

@Injectable()
export class SendInvitationEmailHandler {
  constructor(
    private readonly emailSender: EmailSender,
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: InvitationSentPayload): Promise<void> {
    if (!payload.email) {
      return;
    }

    const acceptUrl = `${this.config.clientBaseUrl}/invites/${payload.token}`;

    const html = buildInvitationEmailHtml({
      inviterFirstName: payload.inviterFirstName ?? "Dikush",
      businessName: payload.businessName ?? "biznesi",
      role: payload.role,
      acceptUrl,
    });

    await this.emailSender.send({
      to: payload.email,
      subject: `Je ftuar te bashkohesh me ${payload.businessName ?? "biznesin"}`,
      html,
    });
  }
}