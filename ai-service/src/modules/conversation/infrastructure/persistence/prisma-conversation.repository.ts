import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import {
  Conversation,
  ConversationMessage,
  ConversationRepository,
} from "../../domain/repositories/conversation.repository";

@Injectable()
export class PrismaConversationRepository extends ConversationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOrCreate(businessId: string, customerPhone: string): Promise<Conversation> {
    const row = await this.prisma.conversation.upsert({
      where: { businessId_customerPhone: { businessId, customerPhone } },
      create: { businessId, customerPhone, channel: "WHATSAPP" },
      update: {},
    });

    return {
      id: row.id,
      businessId: row.businessId,
      customerPhone: row.customerPhone,
      channel: row.channel,
      status: row.status,
      messages: (row.messages as unknown as ConversationMessage[]) ?? [],
      handedOff: row.handedOff,
    };
  }

  async appendMessages(conversationId: string, newMessages: ConversationMessage[]): Promise<void> {
    const current = await this.prisma.conversation.findUniqueOrThrow({ where: { id: conversationId } });
    const existing = (current.messages as unknown as ConversationMessage[]) ?? [];
    const updated = [...existing, ...newMessages];

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { messages: updated as any, lastMessageAt: new Date() },
    });
  }
}
