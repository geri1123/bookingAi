import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QueueName, EmailJobName } from '../../../../infrastructure/queue/queue-names.enum';
import { BusinessActivatedPayload, BusinessCreatedPayload, BusinessSetupReminderPayload, InvitationAcceptedPayload, InvitationSentPayload, PasswordResetEmailPayload, ReservationCancelledEmailPayload, ReservationCreatedEmailPayload, ReservationRescheduledEmailPayload, SubscriptionCanceledPayload, SubscriptionCreatedPayload, SubscriptionExpiredPayload, SubscriptionLimitReachedPayload, VerificationEmailPayload, WelcomeEmailPayload } from '../../domain/types/email-job.types';
@Injectable()
export class EmailQueueProducer {
  constructor(@InjectQueue(QueueName.EMAIL) private readonly emailQueue: Queue) {}

  async enqueueVerificationEmail(payload: VerificationEmailPayload): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_VERIFICATION_EMAIL, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 }, // 2s, 4s, 8s, 16s, 32s
      removeOnComplete: 1000,
      removeOnFail: 5000,
     
      jobId: `verify-email-${payload.userId}-${payload.token}`,
    });
  }

  async enqueueWelcomeEmail(payload: WelcomeEmailPayload): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_WELCOME_EMAIL, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,

      jobId: `welcome-email-${payload.userId}`,
    });
  }
  async enqueueBusinessCreatedEmail(payload:BusinessCreatedPayload):Promise<void>{
    await this.emailQueue.add(EmailJobName.SEND_BUSINESS_CREATET_EMAIL , payload, {
       attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,

      jobId: `business-created-${payload.businessId}`,
    })
  }
  async enqueueInvitationEmail(payload:InvitationSentPayload):Promise<void>{
    await this.emailQueue.add(EmailJobName.SEND_INVITE_EMAIL , payload,{
      attempts:5, 
      backoff:{type:'exponential' , delay:2000},
      removeOnComplete:1000,
      removeOnFail:5000,
       jobId: `invitation-send-${payload.invitationId}`
    })
  }
  async enqueueInvitationAcceptedEmail(payload:InvitationAcceptedPayload):Promise<void>{
    await this.emailQueue.add(EmailJobName.SEND_INVITATION_ACCEPTED_EMAIL, payload,{
      attempts:5,
      backoff:{type:"exponential", delay:2000},
      removeOnComplete:1000,
      removeOnFail:5000,
      jobId:`invitation-accepted-${payload.invitationId}`
    })
  }
  async enqueueBusinessActivatedEmail(payload:BusinessActivatedPayload):Promise<void>{
    await this.emailQueue.add(EmailJobName.SEND_BUSINESS_ACTIVATED_EMAIL,payload ,{
         attempts:5,
      backoff:{type:"exponential", delay:2000},
      removeOnComplete:1000,
      removeOnFail:5000,
      jobId:`business-active-${payload.businessId}`
    } )
  }
  async enqueueBusinessSetUpReminder(payload:BusinessSetupReminderPayload):Promise<void>{
    await this.emailQueue.add(EmailJobName.SEND_BUSINESS_SETUP_REMINDER_EMAIL, payload , {
        attempts:5,
      backoff:{type:"exponential", delay:2000},
      removeOnComplete:1000,
      removeOnFail:5000,
    jobId: `business-setup-reminder-${payload.businessId}`,
    })
  }
  async enqueueReservationCreatedEmail(payload: ReservationCreatedEmailPayload): Promise<void> {
  await this.emailQueue.add(EmailJobName.SEND_RESERVATION_CREATED_EMAIL, payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    jobId: `reservation-created-${payload.reservationId}`,
  });
}

  async enqueueReservationCancelledEmail(payload: ReservationCancelledEmailPayload): Promise<void> {
  await this.emailQueue.add(EmailJobName.SEND_RESERVATION_CANCELLED_EMAIL, payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    
    jobId: `reservation-cancelled-${payload.reservationId}`,
  });
}

  async enqueueReservationRescheduledEmail(payload: ReservationRescheduledEmailPayload): Promise<void> {
  await this.emailQueue.add(EmailJobName.SEND_RESERVATION_RESCHEDULED_EMAIL, payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    
    jobId: `reservation-rescheduled-${payload.reservationId}-${Date.now()}`,
  });
}
 async enqueuePasswordResetRequestedEmail(payload: PasswordResetEmailPayload): Promise<void> {
  await this.emailQueue.add(EmailJobName.SEND_REQUEST_PASSWORD_RESET_EMAIL, payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,

    jobId: `request-password-reset-${payload.userId}-${payload.token}`,
  });
}

 async enqueueSubscriptionLimitReachedEmail(payload: SubscriptionLimitReachedPayload): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_SUBSCRIPTION_LIMIT_REACHED_EMAIL, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
      jobId: `subscription-limit-${payload.businessId}-${Date.now()}`,
    });
  }
   async enqueueSubscriptionExpiredEmail(payload: SubscriptionExpiredPayload): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_SUBSCRIPTION_EXPIRED_EMAIL, payload, {
      attempts: 5,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 1000,
      removeOnFail: 5000,
      jobId: `subscription-expired-${payload.businessId}-${Date.now()}`,
    });
  }
async enqueueSubscriptionCreatedEmail(payload: SubscriptionCreatedPayload): Promise<void> {
  await this.emailQueue.add(EmailJobName.SEND_SUBSCRIPTION_CREATED_EMAIL, payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    jobId: `subscription-created-${payload.businessId}-${Date.now()}`,
  });
}
async enqueueSubscriptionCanceledEmail(payload: SubscriptionCanceledPayload): Promise<void> {
  await this.emailQueue.add(EmailJobName.SEND_SUBSCRIPTION_CANCELED_EMAIL, payload, {
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    jobId: `subscription-canceled-${payload.businessId}-${Date.now()}`,
  });
}
}