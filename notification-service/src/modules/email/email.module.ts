import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../infrastructure/queue/queue-names.enum';
import { KafkaModule } from '../../infrastructure/kafka/kafka.module';

import { EmailSender } from './domain/services/email-sender';
import { ResendEmailSender } from './infrastructure/resend/resend-email-sender';

import { SendVerificationEmailHandler } from './application/handlers/send-verification-email.handler';

import { EmailQueueProducer } from './infrastructure/queue/email-queue.producer';
import { EmailQueueProcessor } from './infrastructure/queue/email-queue.processor';
import { EmailEventsConsumer } from './infrastructure/kafka/email-events.consumer';

@Module({
  imports: [
    KafkaModule, // eksporton KafkaConsumerService
    BullModule.registerQueue({ name: QueueName.EMAIL }), // lidhet me BullmqModule global
  ],
  providers: [
    { provide: EmailSender, useClass: ResendEmailSender },
    SendVerificationEmailHandler,
    EmailQueueProducer,
    EmailQueueProcessor,
    EmailEventsConsumer,
  ],
})
export class EmailModule {}
