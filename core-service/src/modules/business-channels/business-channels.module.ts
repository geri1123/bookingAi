import { Module } from "@nestjs/common";
import { BusinessModule } from "../business/bussines.module";
import { BusinessChannelConnectionFindRepository } from "./domain/repositories/business-channel-connection-find.repository";
import { PrismaBusinessChannelConnectionFindRepository } from "./infrastructure/persistence/repositories/prisma-business-channel-connection-find.repository";
import { BusinessChannelConnectionWriteRepository } from "./domain/repositories/business-channel-connection-write.repository";
import { PrismaBusinessChannelConnectionWriteRepository } from "./infrastructure/persistence/repositories/prisma-business-channel-connection-write.repository";
import { ChannelTokenEncryptor } from "./domain/services/channel-token-encryptor";
import { AesChannelTokenEncryptor } from "./infrastructure/security/aes-channel-token-encryptor";
import { ConnectBusinessChannelUseCase } from "./application/use-cases/connect-business-channel.use-case";
import { DisconnectBusinessChannelUseCase } from "./application/use-cases/disconnect-business-channel.use-case";
import { ToggleChannelAiUseCase } from "./application/use-cases/toggle-channel-ai.use-case";
import { ListBusinessChannelsUseCase } from "./application/use-cases/list-business-channels.use-case";
import { BusinessChannelController } from "./presentation/controllers/business-channel.controller";
import { InternalBusinessChannelController } from "./presentation/controllers/internal-business-channel.controller";

@Module({
  imports: [BusinessModule],
  controllers: [BusinessChannelController, InternalBusinessChannelController],
  providers: [
    { provide: BusinessChannelConnectionFindRepository, useClass: PrismaBusinessChannelConnectionFindRepository },
    { provide: BusinessChannelConnectionWriteRepository, useClass: PrismaBusinessChannelConnectionWriteRepository },
    { provide: ChannelTokenEncryptor, useClass: AesChannelTokenEncryptor },
    ConnectBusinessChannelUseCase,
    DisconnectBusinessChannelUseCase,
    ToggleChannelAiUseCase,
    ListBusinessChannelsUseCase,
  ],
  exports: [BusinessChannelConnectionFindRepository, ChannelTokenEncryptor],
})
export class BusinessChannelsModule {}