import { BusinessChannelConnection as PrismaBusinessChannelConnection } from "@prisma/client";
import { BusinessChannelConnectionEntity } from "../../../domain/entities/business-channel-connection.entity";

export class BusinessChannelConnectionMapper {
  static toDomain(raw: PrismaBusinessChannelConnection): BusinessChannelConnectionEntity {
    return BusinessChannelConnectionEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      channel: raw.channel as any,
      externalAccountId: raw.externalAccountId,
      accessTokenEncrypted: raw.accessTokenEncrypted,
      status: raw.status as any,
      aiEnabled: raw.aiEnabled,
      connectedAt: raw.connectedAt,
      updatedAt: raw.updatedAt,
      disconnectedAt: raw.disconnectedAt,
    });
  }

  static toPersistence(entity: BusinessChannelConnectionEntity) {
    return { ...entity.toPersistence() };
  }
}
