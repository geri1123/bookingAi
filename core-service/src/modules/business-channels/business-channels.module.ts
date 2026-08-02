import { Module } from "@nestjs/common";
import { BusinessModule } from "../business/bussines.module";
import { BusinessChannelConnectionFindRepository } from "./domain/repositories/business-channel-connection-find.repository";
import { PrismaBusinessChannelConnectionFindRepository } from "./infrastructure/persistence/repositories/prisma-business-channel-connection-find.repository";
import { BusinessChannelConnectionWriteRepository } from "./domain/repositories/business-channel-connection-write.repository";
import { PrismaBusinessChannelConnectionWriteRepository } from "./infrastructure/persistence/repositories/prisma-business-channel-connection-write.repository";
import { ChannelTokenEncryptor } from "./domain/services/channel-token-encryptor";
import { AesChannelTokenEncryptor } from "./infrastructure/security/aes-channel-token-encryptor";
import { MetaWebhookSignatureVerifier } from "./infrastructure/security/meta-webhook-signature.verifier";
import { AiServiceClient } from "./infrastructure/http/ai-service.client";
import { MetaMessagingClient } from "./infrastructure/http/meta-messaging.client";
import { ConnectBusinessChannelUseCase } from "./application/use-cases/connect-business-channel.use-case";
import { DisconnectBusinessChannelUseCase } from "./application/use-cases/disconnect-business-channel.use-case";
import { ToggleChannelAiUseCase } from "./application/use-cases/toggle-channel-ai.use-case";
import { ListBusinessChannelsUseCase } from "./application/use-cases/list-business-channels.use-case";
import { HandleInboundChannelMessageUseCase } from "./application/use-cases/handle-inbound-channel-message.use-case";
import { BusinessChannelController } from "./presentation/controllers/business-channel.controller";
import { WhatsappWebhookController } from "./presentation/controllers/whatsapp-webhook.controller";
import { MetaMessagingWebhookController } from "./presentation/controllers/meta-messaging-webhook.controller";

@Module({
  imports: [BusinessModule], // per BusinessFindRepository (verifikon qe biznesi ekziston / eshte ACTIVE)
  controllers: [BusinessChannelController, WhatsappWebhookController, MetaMessagingWebhookController],
  providers: [
    { provide: BusinessChannelConnectionFindRepository, useClass: PrismaBusinessChannelConnectionFindRepository },
    { provide: BusinessChannelConnectionWriteRepository, useClass: PrismaBusinessChannelConnectionWriteRepository },
    { provide: ChannelTokenEncryptor, useClass: AesChannelTokenEncryptor },
    MetaWebhookSignatureVerifier,
    AiServiceClient,
    MetaMessagingClient,
    ConnectBusinessChannelUseCase,
    DisconnectBusinessChannelUseCase,
    ToggleChannelAiUseCase,
    ListBusinessChannelsUseCase,
    HandleInboundChannelMessageUseCase,
  ],
  exports: [BusinessChannelConnectionFindRepository, ChannelTokenEncryptor],
})
export class BusinessChannelsModule {}
