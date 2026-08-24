export interface VerificationEmailPayload {
  userId: string;
  email: string;
  firstName: string;
  token: string;
}

export interface PasswordResetEmailPayload {
  userId: string;
  email: string;
  firstName: string;
  token: string;
}

export interface WelcomeEmailPayload {
  userId: string;
  email: string;
  firstName: string;
}
 
export interface BusinessCreatedPayload {
  businessId: string;
  ownerId: string;
  ownerEmail?: string;
  ownerFirstName?: string;
  name: string;
  type: string;
}


export interface InvitationSentPayload {
  invitationId: string;
  businessId: string;
  email: string;
  role: string;
  token: string;
  inviterFirstName?: string;
  businessName?: string;
}


export interface InvitationAcceptedPayload {
  invitationId: string;
  businessId: string;
  inviterUserId: string;
  inviterEmail: string;
  inviterFirstName?: string;
  newMemberUserId: string;
  newMemberEmail: string;
  newMemberFirstName: string;
  role: string;
  businessName?: string;
}

export interface BusinessActivatedPayload {
  businessId: string;
  businessName: string;
  ownerEmail: string;
  ownerFirstName: string;
}

export interface BusinessSetupReminderPayload {
  businessId: string;
  businessName: string;
  ownerEmail: string;
  ownerFirstName: string;
  missingSteps: string[]; // "SERVICE" | "EMPLOYEE" | "SCHEDULE"
}

export interface ReservationCreatedEmailPayload {
  reservationId: string;
  businessId: string;
  businessName: string;
  notificationEmails: string[];
  customerName: string;
  customerPhone: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  businessTimezone: string;
}

export interface ReservationCancelledEmailPayload {
  reservationId: string;
  businessId: string;
  businessName: string;
  notificationEmails: string[];
  customerName: string;
  customerPhone: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  businessTimezone: string;
}

export interface ReservationRescheduledEmailPayload {
  reservationId: string;
  businessId: string;
  businessName: string;
  notificationEmails: string[];
  customerName: string;
  customerPhone: string;
  serviceName: string;
  previousStartTime: string;
  previousEndTime: string;
  startTime: string;
  endTime: string;
  businessTimezone: string;
}
export interface PasswordResetEmailPayload {
  userId: string;
  email: string;
  firstName: string;
  token: string;
}

export interface SubscriptionLimitReachedPayload {
  businessId: string;
  businessName: string | null;
  ownerEmail: string | null;
  ownerFirstName: string | null;
  messageCount: number;
  messageLimit: number | null;
}
export interface SubscriptionExpiredPayload {
  businessId: string;
  businessName: string | null;
  ownerEmail: string | null;
  ownerFirstName: string | null;
}


export interface SubscriptionCreatedPayload {
  businessId: string;
  businessName: string | null;
  ownerEmail: string | null;
  ownerFirstName: string | null;
  planName: string;
  messageLimit: number | null;
}


export interface SubscriptionCanceledPayload {
  businessId: string;
  businessName: string | null;
  ownerEmail: string | null;
  ownerFirstName: string | null;
}