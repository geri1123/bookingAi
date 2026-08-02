import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import {
  CommunicationChannel,
  Conversation,
  ConversationMessage,
  ConversationRepository,
} from "../../domain/repositories/conversation.repository";

@Injectable()
export class PrismaConversationRepository extends ConversationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOrCreate(
    businessId: string,
    customerExternalId: string,
    channel: CommunicationChannel,
  ): Promise<Conversation> {
    const row = await this.prisma.conversation.upsert({
      where: { businessId_customerExternalId_channel: { businessId, customerExternalId, channel } },
      create: { businessId, customerExternalId, channel },
      update: {},
    });

    return {
      id: row.id,
      businessId: row.businessId,
      customerExternalId: row.customerExternalId,
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