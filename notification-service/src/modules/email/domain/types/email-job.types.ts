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