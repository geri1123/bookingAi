import { Injectable } from "@nestjs/common";
import { BusinessChannelConnectionFindRepository } from "../../domain/repositories/business-channel-connection-find.repository";
import { ChannelConnectionStatus, ChannelType } from "../../domain/entities/business-channel-connection.entity";

export interface BusinessChannelSummary {
  channel: ChannelType;
  status: ChannelConnectionStatus;
  aiEnabled: boolean;
  externalAccountId: string;
  connectedAt: Date;
}

const ALL_CHANNELS: ChannelType[] = [ChannelType.WHATSAPP, ChannelType.MESSENGER, ChannelType.INSTAGRAM];

@Injectable()
export class ListBusinessChannelsUseCase {
  constructor(private readonly channelFindRepo: BusinessChannelConnectionFindRepository) {}

  async execute(businessId: string): Promise<BusinessChannelSummary[]> {
    const connections = await this.channelFindRepo.findAllByBusiness(businessId);
    const byChannel = new Map(connections.map((c) => [c.channel, c]));

    // Kthen gjithmone te 3 kanalet, edhe ata qe s'jane lidhur ende (per UI-n e dashboard-it)
    return ALL_CHANNELS.map((channel) => {
      const existing = byChannel.get(channel);
      if (!existing) {
        return {
          channel,
          status: ChannelConnectionStatus.DISCONNECTED,
          aiEnabled: false,
          externalAccountId: "",
          connectedAt: null as unknown as Date,
        };
      }
      return {
        channel: existing.channel,
        status: existing.status,
        aiEnabled: existing.aiEnabled,
        externalAccountId: existing.externalAccountId,
        connectedAt: existing.connectedAt,
      };
    });
  }
}
