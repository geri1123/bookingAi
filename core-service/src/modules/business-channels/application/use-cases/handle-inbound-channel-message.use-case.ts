import { Injectable, Logger } from "@nestjs/common";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { BusinessStatus } from "../../../business/domain/entities/business.entity";
import { BusinessChannelConnectionFindRepository } from "../../domain/repositories/business-channel-connection-find.repository";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";
import { ChannelTokenEncryptor } from "../../domain/services/channel-token-encryptor";
import { AiServiceClient } from "../../infrastructure/http/ai-service.client";
import { MetaMessagingClient } from "../../infrastructure/http/meta-messaging.client";

export interface HandleInboundChannelMessageInput {
  channel: ChannelType;
  // phone_number_id / page_id / ig_business_account_id qe ka marre mesazhin (llogaria e biznesit)
  receivingAccountId: string;
  // numri i klientit (WhatsApp) ose PSID/IGSID (Messenger/Instagram)
  senderExternalId: string;
  text: string;
}

@Injectable()
export class HandleInboundChannelMessageUseCase {
  private readonly logger = new Logger(HandleInboundChannelMessageUseCase.name);

  constructor(
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly channelFindRepo: BusinessChannelConnectionFindRepository,
    private readonly tokenEncryptor: ChannelTokenEncryptor,
    private readonly aiServiceClient: AiServiceClient,
    private readonly metaMessagingClient: MetaMessagingClient,
  ) {}

  async execute(input: HandleInboundChannelMessageInput): Promise<void> {
    // 1. Gjej cilit biznes i perket kjo llogari (kjo eshte pika qe e "dallon" biznesin)
    const connection = await this.channelFindRepo.findByChannelAndExternalAccountId(
      input.channel,
      input.receivingAccountId,
    );
    if (!connection) {
      this.logger.warn(`S'u gjet lidhje per ${input.channel}/${input.receivingAccountId} - injorohet.`);
      return;
    }

    // 2. Kanali duhet CONNECTED dhe AI e ndezur per te
    if (!connection.isActive || !connection.aiEnabled) {
      return;
    }

    // 3. Biznesi duhet te kete perfunduar regjistrimin (ACTIVE), jo PENDING_SETUP/SUSPENDED/CLOSED
    const business = await this.businessFindRepo.findById(connection.businessId);
    if (!business || business.status !== BusinessStatus.ACTIVE) {
      return;
    }

    // 4. Therret ai-service per te marre pergjigjen
    let replyText: string;
    try {
      replyText = await this.aiServiceClient.handleIncomingMessage({
        businessId: connection.businessId,
        customerExternalId: input.senderExternalId,
        channel: input.channel,
        text: input.text,
      });
    } catch (err) {
      this.logger.error(`ai-service deshtoi per biznesin ${connection.businessId}: ${err instanceof Error ? err.message : err}`);
      return;
    }

    if (!replyText) {
      // "" do te thote biseda eshte handed-off ose AI e fikur per kete biznes ne ai-service
      return;
    }

    // 5. Dekripto token-in vetem per kete thirrje dhe dergo pergjigjen mbrapsht
    const accessToken = this.tokenEncryptor.decrypt(connection.accessTokenEncrypted);
    try {
      await this.metaMessagingClient.sendMessage({
        channel: input.channel,
        senderAccountId: input.receivingAccountId,
        recipientExternalId: input.senderExternalId,
        text: replyText,
        accessToken,
      });
    } catch (err) {
      this.logger.error(`Dergimi i pergjigjes deshtoi per biznesin ${connection.businessId}: ${err instanceof Error ? err.message : err}`);
    }
  }
}
