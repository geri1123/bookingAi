import { Module } from "@nestjs/common";
import { WhatsappWebhookController } from "./presentation/controllers/whatsapp-webhook.controller";
import { MetaMessagingWebhookController } from "./presentation/controllers/meta-messaging-webhook.controller";
import { MetaWebhookSignatureVerifier   } from "./infrastructure/security/meta-webhook-signature.verifier";
import { CoreServiceClient } from "./infrastructure/http/core-service.client";
import { AiServiceClient } from "./infrastructure/http/ai-service.client";
import { MetaMessagingClient } from "./infrastructure/http/meta-messaging.client";
import { MessageLogRepository } from "./domain/repositories/message-log.repository";
import { PrismaMessageLogRepository } from "./infrastructure/persistence/prisma-message-log.repository";
import { HandleInboundMessageUseCase } from "./application/handle-inbound-message.use-case";
import { WebhookIdempotencyService } from "../../infrastructure/redis/webhook-idempotency.service";

@Module({
  controllers: [WhatsappWebhookController, MetaMessagingWebhookController],
  providers: [
    MetaWebhookSignatureVerifier,
    CoreServiceClient,
    AiServiceClient,
    MetaMessagingClient,
    WebhookIdempotencyService,
    HandleInboundMessageUseCase,
    { provide: MessageLogRepository, useClass: PrismaMessageLogRepository },
  ],
})
export class MessagingModule {}