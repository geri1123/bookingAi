export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
}

// Port — domain-i s'di asgjë për Resend, SendGrid apo çfarëdo provider real.
// Implementimi konkret (adapter) jeton në infrastructure/resend/.
export abstract class EmailSender {
  abstract send(input: SendEmailInput): Promise<void>;
}
