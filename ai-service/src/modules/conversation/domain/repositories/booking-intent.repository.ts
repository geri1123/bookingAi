export interface BookingIntentPayload {
  name?: string;
  phone?: string;
  serviceId?: string;
  employeeId?: string;
  resourceId?: string;
  partySize?: number;
  startTime?: string; // ISO
  endTime?: string; // ISO
}

export interface BookingIntent {
  id: string;
  conversationId: string;
  businessId: string;
  status: "COLLECTING" | "CONFIRMED" | "FAILED";
  payload: BookingIntentPayload;
  reservationId: string | null;
}

export abstract class BookingIntentRepository {
  abstract findActiveByConversation(conversationId: string): Promise<BookingIntent | null>;
  abstract createOrUpdate(conversationId: string, businessId: string, payload: BookingIntentPayload): Promise<BookingIntent>;
  abstract markConfirmed(id: string, reservationId: string): Promise<void>;
  abstract markFailed(id: string, reason: string): Promise<void>;
}
