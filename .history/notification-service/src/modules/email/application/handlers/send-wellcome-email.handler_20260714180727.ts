import { Injectable } from '@nestjs/common';
import { EmailSender } from '../../domain/services/email-sender';
import { WelcomeEmailPayload } from '../../domain/types/email-job.types';
import { buildWelcomeEmailHtml } from '../templates/wellcome-email.template';
import { AppConfigService } from '../../../../config/config.service';

@Injectable()
export class SendWelcomeEmailHandler {
  constructor(
    private readonly emailSender: EmailSender, // vetëm porti, s'e njeh Resend
    private readonly config: AppConfigService,
  ) {}

  async handle(payload: WelcomeEmailPayload): Promise<void> {
    const loginUrl = `${this.config.clientBaseUrl}/login`;

    const html = buildWelcomeEmailHtml({
      firstName: payload.firstName,
      loginUrl,
    });

    await this.emailSender.send({
      to: payload.email,
      subject: 'Mirë se erdhe!',
      html,
    });
  }
}