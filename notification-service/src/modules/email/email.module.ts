import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from '../../infrastructure/queue/queue-names.enum';
import { KafkaModule } from '../../infrastructure/kafka/kafka.module';

import { EmailSender } from './domain/services/email-sender';
import { ResendEmailSender } from './infrastructure/resend/resend-email-sender';

import { SendVerificationEmailHandler } from './application/handlers/send-verification-email.handler';
import { SendWelcomeEmailHandler } from './application/handlers/send-wellcome-email.handler';

import { EmailQueueProducer } from './infrastructure/queue/email-queue.producer';
import { EmailQueueProcessor } from './infrastructure/queue/email-queue.processor';
import { EmailEventsConsumer } from './infrastructure/kafka/email-events.consumer';
import { SendBusinessCreatedEmailHandler } from './application/handlers/send-business-created-email.handler';
import { SendInvitationEmailHandler } from './application/handlers/send-invite-email.handler';
import { SendInvitationAcceptedEmailHandler } from './application/handlers/send-invitation-accepted-email.handler';

@Module({
  imports: [
    KafkaModule, 
    BullModule.registerQueue({ name: QueueName.EMAIL }), 
  ],
  providers: [
    { provide: EmailSender, useClass: ResendEmailSender },
    SendVerificationEmailHandler,
    SendWelcomeEmailHandler,
    SendInvitationAcceptedEmailHandler,
    SendBusinessCreatedEmailHandler,
    SendInvitationEmailHandler,
    EmailQueueProducer,
    EmailQueueProcessor,
    EmailEventsConsumer,
  ],
})
export class EmailModule {}