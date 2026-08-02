// E njejta strukture qe perdor Prisma per enum-et (const object + tip i nxjerre),
// keshtu qe eshte plotesisht i pershtatshem me $Enums.CommunicationChannel te generuar.
export const CommunicationChannel = {
  WHATSAPP: "WHATSAPP",
  MESSENGER: "MESSENGER",
  INSTAGRAM: "INSTAGRAM",
  VOICE: "VOICE",
} as const;
export type CommunicationChannel = (typeof CommunicationChannel)[keyof typeof CommunicationChannel];

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  at: string; // ISO timestamp
}

export interface Conversation {
  id: string;
  businessId: string;
  customerExternalId: string;
  channel: CommunicationChannel;
  status: "ACTIVE" | "AWAITING_CONFIRMATION" | "CLOSED";
  messages: ConversationMessage[];
  handedOff: boolean;
}

export abstract class ConversationRepository {
  abstract findOrCreate(
    businessId: string,
    customerExternalId: string,
    channel: CommunicationChannel,
  ): Promise<Conversation>;
  abstract appendMessages(conversationId: string, newMessages: ConversationMessage[]): Promise<void>;
}