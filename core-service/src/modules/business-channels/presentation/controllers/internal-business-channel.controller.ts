import { Controller, Get, NotFoundException, Query, UseGuards } from "@nestjs/common";
import { Public } from "@bookingai/auth";
import { InternalApiKeyGuard } from "../../../../common/guards/internal-api-key.guard";
import { BusinessChannelConnectionFindRepository } from "../../domain/repositories/business-channel-connection-find.repository";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { BusinessStatus } from "../../../business/domain/entities/business.entity";
import { ChannelTokenEncryptor } from "../../domain/services/channel-token-encryptor";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";


@Public()
@UseGuards(InternalApiKeyGuard)
@Controller("internal/business-channels")
export class InternalBusinessChannelController {
  constructor(
    private readonly channelFindRepo: BusinessChannelConnectionFindRepository,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly tokenEncryptor: ChannelTokenEncryptor,
  ) {}

  @Get("lookup")
  async lookup(@Query("channel") channel: ChannelType, @Query("accountId") accountId: string) {
    const connection = await this.channelFindRepo.findByChannelAndExternalAccountId(channel, accountId);
    if (!connection) {
      throw new NotFoundException("Lidhje e panjohur per kete kanal/llogari.");
    }

    const business = await this.businessFindRepo.findById(connection.businessId);

    return {
      businessId: connection.businessId,
      isActive: connection.isActive,
      aiEnabled: connection.aiEnabled,
      businessIsActive: business?.status === BusinessStatus.ACTIVE,
      accessToken: connection.isActive ? this.tokenEncryptor.decrypt(connection.accessTokenEncrypted) : null,
    };
  }
}