import { Injectable } from '@nestjs/common';
import { EmailSender } from '../../domain/services/email-sender';
import { VerificationEmailPayload } from '../../domain/types/email-job.types';
import { buildVerificationEmailHtml } from '../templates/verification-email.template';
import { AppConfigService } from '../../../../config/config.service';

@Injectable()
export class SendVerificationEmailHandler {
  constructor(
    private readonly emailSender: EmailSender, // vetëm porti, s'e njeh Resend
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: VerificationEmailPayload): Promise<void> {
    const verifyUrl = `${this.config.clientBaseUrl}/verify-email?token=${payload.token}`;

    const html = buildVerificationEmailHtml({
      firstName: payload.firstName,
      verifyUrl,
    });

    await this.emailSender.send({
      to: payload.email,
      subject: 'Verify your email',
      html,
    });
  }
}
