import { Module } from "@nestjs/common";
import { AiSettingsRepository } from "./domain/repositories/ai-settings.repository";
import { PrismaAiSettingsRepository } from "./infrastructure/persistence/prisma-ai-settings.repository";
import { ConversationRepository } from "./domain/repositories/conversation.repository";
import { PrismaConversationRepository } from "./infrastructure/persistence/prisma-conversation.repository";
import { BookingIntentRepository } from "./domain/repositories/booking-intent.repository";
import { PrismaBookingIntentRepository } from "./infrastructure/persistence/prisma-booking-intent.repository";
import { CoreServiceClient } from "./infrastructure/http/core-service.client";
import { BillingServiceClient } from "./infrastructure/http/billing-service.client";
import { AnthropicClient } from "./infrastructure/http/anthropic.client";
import { HandleIncomingMessageUseCase } from "./application/handle-incoming-message.use-case";
import { SystemPromptBuilderService } from "./application/services/system-prompt-builder.service";
import { ToolExecutorService } from "./application/services/tool-executor.service";
import { ConversationController } from "./presentation/controllers/conversation.controller";
import { AiSettingsController } from "./presentation/controllers/ai-settings.controller"; 
import { InternalApiKeyGuard } from "../../common/guards/internal-api-key.guard";
import { GeminiClient } from "./infrastructure/http/gemini.client";

@Module({
  controllers: [ConversationController, AiSettingsController], 
  providers: [
    { provide: AiSettingsRepository, useClass: PrismaAiSettingsRepository },
    { provide: ConversationRepository, useClass: PrismaConversationRepository },
    { provide: BookingIntentRepository, useClass: PrismaBookingIntentRepository },
    CoreServiceClient,
    BillingServiceClient,
    AnthropicClient,
    HandleIncomingMessageUseCase,
    SystemPromptBuilderService,
    ToolExecutorService,
    InternalApiKeyGuard,
    GeminiClient,
  ],
})
export class ConversationModule {}