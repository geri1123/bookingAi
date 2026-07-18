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