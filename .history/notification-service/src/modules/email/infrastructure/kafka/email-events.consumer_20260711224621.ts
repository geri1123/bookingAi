import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '../../../../infrastructure/kafka/kafka-consumer.service';
import { EmailQueueProducer } from '../queue/email-queue.producer';
import { VerificationEmailPayload } from '../../domain/types/email-job.types';
import { getErrorMessage } from '../../../../common/utils/error.utils';

const TOPICS = {
  EMAIL_VERIFICATION_REQUESTED: 'user.email-verification.requested',
} as const;

@Injectable()
export class EmailEventsConsumer implements OnModuleInit {
  private readonly logger = new Logger(EmailEventsConsumer.name);

  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly emailQueueProducer: EmailQueueProducer,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe(
      [TOPICS.EMAIL_VERIFICATION_REQUESTED],
      async ({ topic, message }) => {
        if (!message.value) return;

        try {
          const payload = JSON.parse(message.value.toString()) as VerificationEmailPayload;
          await this.emailQueueProducer.enqueueVerificationEmail(payload);
        } catch (err) {
          this.logger.error(`Failed to process message from ${topic}: ${getErrorMessage(err)}`);
        }
      },
    );
  }
}