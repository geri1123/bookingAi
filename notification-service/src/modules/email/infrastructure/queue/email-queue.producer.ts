import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueName, EmailJobName } from '../../../../infrastructure/queue/queue-names.enum';
import { VerificationEmailPayload } from '../../domain/types/email-job.types';

@Injectable()
export class EmailQueueProducer {
  constructor(@InjectQueue(QueueName.EMAIL) private readonly emailQueue: Queue) {}

  async enqueueVerificationEmail(payload: VerificationEmailPayload): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_VERIFICATION_EMAIL, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 }, // 2s, 4s, 8s, 16s, 32s
      removeOnComplete: 1000,
      removeOnFail: 5000,
     
      jobId: `verify-email:${payload.userId}:${payload.token}`,
    });
  }
}
