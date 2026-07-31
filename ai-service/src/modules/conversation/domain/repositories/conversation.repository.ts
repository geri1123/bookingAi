export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  at: string; // ISO timestamp
}

export interface Conversation {
  id: string;
  businessId: string;
  customerPhone: string;
  channel: "WHATSAPP" | "VOICE";
  status: "ACTIVE" | "AWAITING_CONFIRMATION" | "CLOSED";
  messages: ConversationMessage[];
  handedOff: boolean;
}

export abstract class ConversationRepository {
  abstract findOrCreate(businessId: string, customerPhone: string): Promise<Conversation>;
  abstract appendMessages(conversationId: string, newMessages: ConversationMessage[]): Promise<void>;
}
