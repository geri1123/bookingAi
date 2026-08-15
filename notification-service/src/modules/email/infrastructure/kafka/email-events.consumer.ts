import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '../../../../infrastructure/kafka/kafka-consumer.service';
import { EmailQueueProducer } from '../queue/email-queue.producer';
import { BusinessActivatedPayload, BusinessCreatedPayload, BusinessSetupReminderPayload, InvitationAcceptedPayload, InvitationSentPayload, PasswordResetEmailPayload, ReservationCancelledEmailPayload, ReservationCreatedEmailPayload, ReservationRescheduledEmailPayload, VerificationEmailPayload, WelcomeEmailPayload } from '../../domain/types/email-job.types';
import { getErrorMessage } from '../../../../common/utils/error.utils';

const TOPICS = {
  EMAIL_VERIFICATION_REQUESTED: 'user.email-verification.requested',
  WELCOME_EMAIL_REQUESTED: 'user.welcome-email.requested',
  BUSINESS_CREATED:'business.created',
  BUSINESS_ACTIVATED: 'business.activated',          
  BUSINESS_SETUP_REMINDER: 'business.setup-reminder',  
  INVITATION_SEND:'invitation.sent',
  INVITATION_ACCEPTED:'invitation.accepted',
  RESERVATION_CREATED: 'reservation.created',
  RESERVATION_CANCELLED: 'reservation.cancelled',
  RESERVATION_RESCHEDULED: 'reservation.rescheduled',
 PASSWORD_RESET_REQUESTED: 'user.password-reset.requested',
  SUBSCRIPTION_MESSAGE_LIMIT_REACHED: 'subscription.message-limit-reached'
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
      
      [
        TOPICS.EMAIL_VERIFICATION_REQUESTED, 
        TOPICS.WELCOME_EMAIL_REQUESTED , 
        TOPICS.BUSINESS_CREATED , 
        TOPICS.INVITATION_SEND ,
        TOPICS.INVITATION_ACCEPTED , 
        TOPICS.BUSINESS_SETUP_REMINDER ,
        TOPICS.BUSINESS_ACTIVATED,
        TOPICS.RESERVATION_CREATED,
        TOPICS.RESERVATION_CANCELLED,
        TOPICS.RESERVATION_RESCHEDULED,
        TOPICS.PASSWORD_RESET_REQUESTED,
         TOPICS.SUBSCRIPTION_MESSAGE_LIMIT_REACHED
      ],
      async ({ topic, message }) => {
        if (!message.value) return;

        try {
          switch (topic) {
            case TOPICS.EMAIL_VERIFICATION_REQUESTED: {
              const payload = JSON.parse(message.value.toString()) as VerificationEmailPayload;
              await this.emailQueueProducer.enqueueVerificationEmail(payload);
              break;
            }

            case TOPICS.WELCOME_EMAIL_REQUESTED: {
              const payload = JSON.parse(message.value.toString()) as WelcomeEmailPayload;
              await this.emailQueueProducer.enqueueWelcomeEmail(payload);
              break;
            }
            case TOPICS.BUSINESS_CREATED:{
              const payload=JSON.parse(message.value.toString()) as BusinessCreatedPayload;
              await this.emailQueueProducer.enqueueBusinessCreatedEmail(payload);
              break;

            }
            case TOPICS.INVITATION_SEND:{
              const payload=JSON.parse(message.value.toString()) as InvitationSentPayload;
              await this.emailQueueProducer.enqueueInvitationEmail(payload);
              break;
            }
            case TOPICS.INVITATION_ACCEPTED:{
              const payload=JSON.parse(message.value.toString()) as InvitationAcceptedPayload;
              await this.emailQueueProducer.enqueueInvitationAcceptedEmail(payload);
              break
            }
            case TOPICS.BUSINESS_ACTIVATED:{
              const payload=JSON.parse(message.value.toString()) as BusinessActivatedPayload;
              await this.emailQueueProducer.enqueueBusinessActivatedEmail(payload);
              break 
            }
            
           case TOPICS.BUSINESS_SETUP_REMINDER: {
             const payload = JSON.parse(message.value.toString()) as BusinessSetupReminderPayload;
              await this.emailQueueProducer.enqueueBusinessSetUpReminder(payload);
              break;
            }
            case TOPICS.RESERVATION_CREATED:{
              const payload =JSON.parse(message.value.toString()) as ReservationCreatedEmailPayload;
              await this.emailQueueProducer.enqueueReservationCreatedEmail(payload);
              break;

            }
            case TOPICS.RESERVATION_CANCELLED:{
              const payload = JSON.parse(message.value.toString()) as ReservationCancelledEmailPayload;
              await this.emailQueueProducer.enqueueReservationCancelledEmail(payload);
              break;
            }
            case TOPICS.RESERVATION_RESCHEDULED:{
              const payload = JSON.parse(message.value.toString()) as ReservationRescheduledEmailPayload;
              await this.emailQueueProducer.enqueueReservationRescheduledEmail(payload);
              break;
            }
            case TOPICS.PASSWORD_RESET_REQUESTED: {
              const payload = JSON.parse(message.value.toString()) as PasswordResetEmailPayload;
              await this.emailQueueProducer.enqueuePasswordResetRequestedEmail(payload);
              break;
            }
            default:
              this.logger.warn(`No handler wired for topic: ${topic}`);
          }
        } catch (err) {
          this.logger.error(`Failed to process message from ${topic}: ${getErrorMessage(err)}`);
        }
      },
    );
  }
}