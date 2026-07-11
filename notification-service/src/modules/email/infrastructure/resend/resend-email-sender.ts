import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { EmailSender, SendEmailInput } from '../../domain/services/email-sender';
import { AppConfigService } from '../../../../config/config.service';

@Injectable()
export class ResendEmailSender implements EmailSender {
  private readonly logger = new Logger(ResendEmailSender.name);
  private readonly resend: Resend;

  constructor(private readonly config: AppConfigService) {
    this.resend = new Resend(this.config.resendApiKey);
  }

  async send(input: SendEmailInput): Promise<void> {
    const { data, error } = await this.resend.emails.send({
      from: this.config.resendFromEmail,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      // hedh gabim real — kështu BullMQ e sheh si dështim dhe bën retry
      this.logger.error(`Resend failed for ${input.to}: ${error.message}`);
      throw new Error(`Resend error: ${error.message}`);
    }

    this.logger.log(`Email sent to ${input.to} (id: ${data?.id})`);
  }
}
