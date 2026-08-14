import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../../../config/config.service";
import { CommunicationChannel, ConversationRepository } from "../domain/repositories/conversation.repository";
import { AiSettingsRepository } from "../domain/repositories/ai-settings.repository";
import { BookingIntentRepository } from "../domain/repositories/booking-intent.repository";
import { CoreServiceClient } from "../infrastructure/http/core-service.client";
import { BillingServiceClient } from "../infrastructure/http/billing-service.client";
import {
  AnthropicClient,
  AnthropicContentBlock,
  AnthropicMessage,
  AnthropicToolResultContent,
} from "../infrastructure/http/anthropic.client";
import { GeminiClient } from "../infrastructure/http/gemini.client";
import { resolveToolsForBusiness } from "./tools";
import { DistributedLockService } from "../../../infrastructure/redis/distributed-lock.service";
import { SystemPromptBuilderService } from "./services/system-prompt-builder.service";
import { ToolExecutorService } from "./services/tool-executor.service";

export interface HandleIncomingMessageInput {
  businessId: string;
  customerExternalId: string; // nr. telefoni per WhatsApp; PSID/IGSID per Messenger/Instagram
  channel: CommunicationChannel;
  text: string;
}

export interface HandleIncomingMessageOutput {
  replyText: string;
}

const MAX_TOOL_ROUNDS = 4;

@Injectable()
export class HandleIncomingMessageUseCase {
  private readonly logger = new Logger(HandleIncomingMessageUseCase.name);

  constructor(
    private readonly conversationRepo: ConversationRepository,
    private readonly aiSettingsRepo: AiSettingsRepository,
    private readonly bookingIntentRepo: BookingIntentRepository,
    private readonly coreServiceClient: CoreServiceClient,
    private readonly billingServiceClient: BillingServiceClient,
    private readonly anthropicClient: AnthropicClient,
    private readonly appConfig: AppConfigService,
    private readonly lockService: DistributedLockService,
    private readonly systemPromptBuilder: SystemPromptBuilderService,
    private readonly toolExecutor: ToolExecutorService,
  ) {}

  async execute(input: HandleIncomingMessageInput): Promise<HandleIncomingMessageOutput> {
    const lockKey = `conversation:${input.businessId}:${input.channel}:${input.customerExternalId}`;
    return this.lockService.withLock(lockKey, () => this.handleLocked(input));
  }

  private async handleLocked(input: HandleIncomingMessageInput): Promise<HandleIncomingMessageOutput> {
    const conversation = await this.conversationRepo.findOrCreate(
      input.businessId,
      input.customerExternalId,
      input.channel,
    );

    if (conversation.handedOff) {
      return { replyText: "" };
    }

    const settings = await this.aiSettingsRepo.findByBusinessId(input.businessId);
    if (settings && !settings.isEnabled) {
      return { replyText: "" };
    }

    const usage = await this.billingServiceClient.consumeMessageSafe(input.businessId);
    if (!usage.allowed) {
      this.logger.warn(
        `Limiti i mesazheve u arrit per biznesin ${input.businessId} (${usage.messageCount}/${usage.messageLimit}).`,
      );
      return { replyText: "" };
    }

    const business = await this.coreServiceClient.getBusinessInfo(input.businessId);
    const services = await this.coreServiceClient.getServices(input.businessId);

    const nowIso = new Date().toISOString();
    await this.conversationRepo.appendMessages(conversation.id, [
      { role: "user", content: input.text, at: nowIso },
    ]);

    const history = [...conversation.messages, { role: "user" as const, content: input.text, at: nowIso }].slice(
      -this.appConfig.maxContextMessages,
    );

    const messages: AnthropicMessage[] = history.map((m) => ({ role: m.role, content: m.content }));

  const systemPrompt = this.systemPromptBuilder.build(
  business,
  settings?.systemPrompt,
  conversation.channel,
  services,
);
    const tools = resolveToolsForBusiness(business);

    const replyText = await this.runConversationLoop(messages, systemPrompt, tools, input, conversation.id);

    await this.conversationRepo.appendMessages(conversation.id, [
      { role: "assistant", content: replyText, at: new Date().toISOString() },
    ]);

    return { replyText };
  }

  private async runConversationLoop(
    messages: AnthropicMessage[],
    systemPrompt: string,
    tools: ReturnType<typeof resolveToolsForBusiness>,
    input: HandleIncomingMessageInput,
    conversationId: string,
  ): Promise<string> {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await this.anthropicClient.createMessage({
        system: systemPrompt,
        messages,
        tools,
      });

      const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");

      if (toolUseBlocks.length === 0) {
        return this.extractText(response.content);
      }

      messages.push({ role: "assistant", content: response.content });

      const toolResults: AnthropicToolResultContent[] = [];
      for (const block of toolUseBlocks) {
        if (block.type !== "tool_use") continue;
        const resultText = await this.toolExecutor.execute(block.name, block.input, input, conversationId);
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: resultText });
      }

      messages.push({ role: "user", content: toolResults });
    }

    this.logger.warn(`U arrit limiti i rundeve te tool-use per bisedën ${conversationId}`);
    return "Me fal, po me duhet pak me shume kohe per kete kerkese. Dikush nga ekipi do t'ju kontaktoje shpejt.";
  }

  private extractText(content: AnthropicContentBlock[]): string {
    return content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();
  }
}