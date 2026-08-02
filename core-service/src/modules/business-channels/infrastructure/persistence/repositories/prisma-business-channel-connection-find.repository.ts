import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessChannelConnectionFindRepository } from "../../../domain/repositories/business-channel-connection-find.repository";
import { BusinessChannelConnectionEntity, ChannelType } from "../../../domain/entities/business-channel-connection.entity";
import { BusinessChannelConnectionMapper } from "../mappers/business-channel-connection.mapper";

@Injectable()
export class PrismaBusinessChannelConnectionFindRepository implements BusinessChannelConnectionFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByBusinessAndChannel(
    businessId: string,
    channel: ChannelType,
  ): Promise<BusinessChannelConnectionEntity | null> {
    const row = await this.prisma.businessChannelConnection.findUnique({
      where: { businessId_channel: { businessId, channel } },
    });
    return row ? BusinessChannelConnectionMapper.toDomain(row) : null;
  }

  async findAllByBusiness(businessId: string): Promise<BusinessChannelConnectionEntity[]> {
    const rows = await this.prisma.businessChannelConnection.findMany({
      where: { businessId },
      orderBy: { channel: "asc" },
    });
    return rows.map(BusinessChannelConnectionMapper.toDomain);
  }

  async findByChannelAndExternalAccountId(
    channel: ChannelType,
    externalAccountId: string,
  ): Promise<BusinessChannelConnectionEntity | null> {
    const row = await this.prisma.businessChannelConnection.findUnique({
      where: { channel_externalAccountId: { channel, externalAccountId } },
    });
    return row ? BusinessChannelConnectionMapper.toDomain(row) : null;
  }
}
