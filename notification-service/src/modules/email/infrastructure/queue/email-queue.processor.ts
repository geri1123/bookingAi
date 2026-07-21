import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueName, EmailJobName } from '../../../../infrastructure/queue/queue-names.enum';
import { SendVerificationEmailHandler } from '../../application/handlers/send-verification-email.handler';
import { SendWelcomeEmailHandler } from '../../application/handlers/send-wellcome-email.handler';
import { BusinessActivatedPayload, BusinessCreatedPayload, BusinessSetupReminderPayload, InvitationAcceptedPayload, InvitationSentPayload, VerificationEmailPayload, WelcomeEmailPayload } from '../../domain/types/email-job.types';
import { SendBusinessCreatedEmailHandler } from '../../application/handlers/send-business-created-email.handler';
import { SendInvitationEmailHandler } from '../../application/handlers/send-invite-email.handler';
import { SendInvitationAcceptedEmailHandler } from '../../application/handlers/send-invitation-accepted-email.handler';
import { SendBusinessActivatedEmailHandler } from '../../application/handlers/send-business-activated-email.handler';
import { SendBusinessSetupReminderEmailHandler } from '../../application/handlers/send-business-setup-reminder-email.handler';

@Processor(QueueName.EMAIL, {
  concurrency: 10, 
  limiter: {
    max: 10, // max 10 jobs...
    duration: 1000, 
  },
})
export class EmailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(
    private readonly verificationHandler: SendVerificationEmailHandler,
    private readonly welcomeHandler: SendWelcomeEmailHandler,
    private readonly businessCreatedHandler:SendBusinessCreatedEmailHandler,
    private readonly sendInvitationEmailHandler:SendInvitationEmailHandler,
    private readonly sendInvitationAcceptedEmailHandler:SendInvitationAcceptedEmailHandler,
    private readonly sendBusinessActivatedEmailHandler:SendBusinessActivatedEmailHandler,
    private readonly sendBusinessSetupReminderEmailHandler:SendBusinessSetupReminderEmailHandler
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJobName.SEND_VERIFICATION_EMAIL:
        return this.verificationHandler.handle(job.data as VerificationEmailPayload);

      case EmailJobName.SEND_WELCOME_EMAIL:
        return this.welcomeHandler.handle(job.data as WelcomeEmailPayload);
      case EmailJobName.SEND_BUSINESS_CREATET_EMAIL:
        return this.businessCreatedHandler.handle(job.data as BusinessCreatedPayload);
      case EmailJobName.SEND_INVITE_EMAIL:
        return this.sendInvitationEmailHandler.handle(job.data as InvitationSentPayload);
      case EmailJobName.SEND_INVITATION_ACCEPTED_EMAIL:
        return this.sendInvitationAcceptedEmailHandler.handle(job.data as InvitationAcceptedPayload);
      case EmailJobName.SEND_BUSINESS_ACTIVATED_EMAIL: 
         return this.sendBusinessActivatedEmailHandler.handle(job.data as BusinessActivatedPayload);
      case EmailJobName.SEND_BUSINESS_SETUP_REMINDER_EMAIL:
      return this.sendBusinessSetupReminderEmailHandler.handle(job.data as BusinessSetupReminderPayload)
         default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} (${job.name}) completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(
      `Job ${job?.id} (${job?.name}) failed on attempt ${job?.attemptsMade}: ${error.message}`,
    );
  }
}