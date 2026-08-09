export enum EventName {
  
    USER_EMAIL_VERIFICATION_REQUESTED ='user.email-verification.requested',
    USER_WELCOME_EMAIL_REQUESTED ='user.welcome-email.requested',
  USER_CREATED = 'user.created',

  USER_UPDATED = 'user.updated',
  //bussines
   BUSINESS_CREATED = 'business.created',
    SERVICE_CREATED = 'service.created',  
      BUSINESS_ACTIVATED = 'business.activated',           
  BUSINESS_SETUP_REMINDER = 'business.setup-reminder',
  BUSINESS_SETUP_REMINDER_CHECK = 'business.setup-reminder-check',
  EMPLOYEE_CREATED = 'employee.created',
  SCHEDULE_CREATED = 'schedule.created',
  RESOURCE_CREATED = 'resource.created',
  BUSINESS_PROFILE_IMAGE_UPDATED = 'business.profile-image.updated',
  BUSINESS_LOCATION_UPDATED = 'business.location.updated',
   //invitation
   INVITATION_SENT = 'invitation.sent',
   INVITATION_ACCEPTED='invitation.accepted',
   //password reset
   USER_PASSWORD_RESET_REQUESTED = 'user.password-reset.requested',
   //reservation
   RESERVATION_CREATED = 'reservation.created',
   RESERVATION_CANCELLED = 'reservation.cancelled',
   RESERVATION_RESCHEDULED = 'reservation.rescheduled',

}