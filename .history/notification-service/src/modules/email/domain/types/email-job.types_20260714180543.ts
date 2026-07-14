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
 