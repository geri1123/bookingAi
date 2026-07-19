import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueName, EmailJobName } from '../../../../infrastructure/queue/queue-names.enum';
import { SendVerificationEmailHandler } from '../../application/handlers/send-verification-email.handler';
import { SendWelcomeEmailHandler } from '../../application/handlers/send-wellcome-email.handler';
import { BusinessCreatedPayload, InvitationSentPayload, VerificationEmailPayload, WelcomeEmailPayload } from '../../domain/types/email-job.types';
import { SendBusinessCreatedEmailHandler } from '../../application/handlers/send-business-created-email.handler';
import { SendInvitationEmailHandler } from '../../application/handlers/send-invite-email.handler';

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
    private readonly sendInvitationEmailHandler:SendInvitationEmailHandler
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