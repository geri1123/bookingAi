import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueName, EmailJobName } from '../../../../infrastructure/queue/queue-names.enum';
import { SendVerificationEmailHandler } from '../../application/handlers/send-verification-email.handler';
import { VerificationEmailPayload } from '../../domain/types/email-job.types';

@Processor(QueueName.EMAIL, {
  concurrency: 10, 
  limiter: {
    max: 10, 
    duration: 1000, 
  },
})
export class EmailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(private readonly verificationHandler: SendVerificationEmailHandler) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case EmailJobName.SEND_VERIFICATION_EMAIL:
        return this.verificationHandler.handle(job.data as VerificationEmailPayload);

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
