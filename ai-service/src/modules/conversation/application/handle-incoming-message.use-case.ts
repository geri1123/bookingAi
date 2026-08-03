import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../../../config/config.service";
import { CommunicationChannel, ConversationRepository } from "../domain/repositories/conversation.repository";
import { AiSettingsRepository } from "../domain/repositories/ai-settings.repository";
import { BookingIntentRepository } from "../domain/repositories/booking-intent.repository";
import { CoreServiceClient, CoreServiceError, BusinessInfo } from "../infrastructure/http/core-service.client";
import {
  AnthropicContentBlock,
  AnthropicMessage,
  AnthropicToolResultContent,
} from "../infrastructure/http/anthropic.client";
import { GeminiClient } from "../infrastructure/http/gemini.client";
import { resolveToolsForBusiness } from "./tools";
import { DistributedLockService } from "../../../infrastructure/redis/distributed-lock.service";

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
    private readonly anthropicClient: GeminiClient,
    private readonly appConfig: AppConfigService,
    private readonly lockService: DistributedLockService,
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

    const business = await this.coreServiceClient.getBusinessInfo(input.businessId);

    const nowIso = new Date().toISOString();
    await this.conversationRepo.appendMessages(conversation.id, [
      { role: "user", content: input.text, at: nowIso },
    ]);

    const history = [...conversation.messages, { role: "user" as const, content: input.text, at: nowIso }].slice(
      -this.appConfig.maxContextMessages,
    );

    const messages: AnthropicMessage[] = history.map((m) => ({ role: m.role, content: m.content }));

  const systemPrompt = this.buildSystemPrompt(
  business,
  settings?.systemPrompt,
  conversation.channel,
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
        const resultText = await this.executeTool(block.name, block.input, input, conversationId);
        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: resultText });
      }

      messages.push({ role: "user", content: toolResults });
    }

    this.logger.warn(`U arrit limiti i rundeve te tool-use per bisedën ${conversationId}`);
    return "Me fal, po me duhet pak me shume kohe per kete kerkese. Dikush nga ekipi do t'ju kontaktoje shpejt.";
  }

  private async executeTool(
    name: string,
    toolInput: Record<string, unknown>,
    input: HandleIncomingMessageInput,
    conversationId: string,
  ): Promise<string> {
    try {
      if (name === "check_availability") {
        const result = await this.coreServiceClient.checkAvailability({
          businessId: input.businessId,
          date: toolInput.date as string,
          serviceId: toolInput.serviceId as string | undefined,
          employeeId: toolInput.employeeId as string | undefined,
        });
        return JSON.stringify(result);
      }

      if (name === "check_resource_availability") {
        const result = await this.coreServiceClient.checkResourceAvailability({
          businessId: input.businessId,
          startTime: toolInput.startTime as string,
          endTime: toolInput.endTime as string,
          partySize: toolInput.partySize as number | undefined,
        });
        return JSON.stringify(result);
      }

      if (name === "create_reservation") {
        // Fallback-u ne customerExternalId eshte i sigurte VETEM per WhatsApp, sepse atje
        // ID-ja e kanalit eshte njekohesisht dhe numri real i telefonit. Per Messenger/Instagram
        // eshte PSID/IGSID, jo telefon — atje 'phone' duhet te vije domosdo nga vete biseda.
        const fallbackPhone = input.channel === "WHATSAPP" ? input.customerExternalId : undefined;
        const phone = (toolInput.phone as string | undefined) ?? fallbackPhone;

        if (!phone) {
          return JSON.stringify({
            success: false,
            error: "Numri i telefonit i klientit mungon — kerkoji klientit ta japi para se te rezervosh.",
          });
        }

        const intent = await this.bookingIntentRepo.createOrUpdate(conversationId, input.businessId, {
          name: toolInput.name as string,
          phone,
          serviceId: toolInput.serviceId as string | undefined,
          employeeId: toolInput.employeeId as string | undefined,
          resourceId: toolInput.resourceId as string | undefined,
          partySize: toolInput.partySize as number | undefined,
          startTime: toolInput.startTime as string,
          endTime: toolInput.endTime as string | undefined,
        });

        try {
          const reservation = await this.coreServiceClient.createReservation({
            businessId: input.businessId,
            name: toolInput.name as string,
            phone,
            serviceId: toolInput.serviceId as string | undefined,
            employeeId: toolInput.employeeId as string | undefined,
            resourceId: toolInput.resourceId as string | undefined,
            partySize: toolInput.partySize as number | undefined,
            startTime: toolInput.startTime as string,
            endTime: toolInput.endTime as string | undefined,
          });

          const reservationId = reservation?.reservation?.id;
          if (reservationId) {
            await this.bookingIntentRepo.markConfirmed(intent.id, reservationId);
          }
          return JSON.stringify({ success: true, reservation: reservation?.reservation });
        } catch (err) {
          const message = err instanceof CoreServiceError ? JSON.stringify(err.body) : String(err);
          await this.bookingIntentRepo.markFailed(intent.id, message);
          return JSON.stringify({ success: false, error: message });
        }
      }

      return JSON.stringify({ success: false, error: `Vegel e panjohur: ${name}` });
    } catch (err) {
      this.logger.error(`Gabim gjate ekzekutimit te vegles ${name}: ${err instanceof Error ? err.message : err}`);
      return JSON.stringify({ success: false, error: "Gabim i papritur." });
    }
  }

  private channelLabel(channel: CommunicationChannel): string {
    switch (channel) {
      case "WHATSAPP":
        return "WhatsApp";
      case "MESSENGER":
        return "Facebook Messenger";
      case "INSTAGRAM":
        return "Instagram Direct";
      case "VOICE":
        return "telefon";
      default:
        return "WhatsApp";
    }
  }

  private extractText(content: AnthropicContentBlock[]): string {
    return content
      .filter((b) => b.type === "text")
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n")
      .trim();
  }
private buildSystemPrompt(
    business: BusinessInfo,
    custom: string | null | undefined,
    channel: CommunicationChannel,
  ): string {
    const fallbackLang = business.language ?? this.appConfig.defaultLanguage;
    const channelLabel = this.channelLabel(channel);

    // GJITHMONE auto-detect — s'lejohet me qe biznesi te forcoje nje gjuhe fikse
    // qe injoron gjuhen reale te klientit.
    const languageInstruction = [
      "Zbulo automatikisht gjuhen ne te cilen shkruan klienti duke u bazuar te mesazhi/mesazhet e tij, dhe pergjigju GJITHMONE ne ate gjuhe (p.sh. shqip, anglisht, italisht, etj).",
      "Nese klienti ndryshon gjuhe gjate bisedes, ndrysho edhe ti ne pergjigjet e tua.",
      `Nese mesazhi i klientit eshte shume i shkurter ose i paqarte per te percaktuar gjuhen (p.sh. vetem "ok" ose emoji), perdor si parazgjedhje gjuhen: ${fallbackLang}.`,
    ].join(" ");

    const strategyHint = business.type === "HOTEL"
      ? "Perdor 'check_resource_availability' me startTime = data e check-in dhe endTime = data e check-out (jo ore, DATA te plota) per te gjetur dhoma te lira. Perpara 'create_reservation' konfirmo domosdo NUMRIN E NETEVE me klientin, dhe dergo endTime SAKTE si daten e check-out."
      : business.needsEmployee
        ? "Perdor 'check_availability' per te propozuar ore te lira reale sipas punonjesit, jo te shpikura."
        : business.needsResource
          ? "Perdor 'check_resource_availability' per te propozuar ore te lira reale sipas tavolines/dhomes (merr parasysh partySize), jo te shpikura."
          : "Ky biznes s'ka kontroll disponueshmerie — pasi klienti konfirmon oren e deshiruar, mund te thrrasesh direkt 'create_reservation'.";

    const base = [
      `Je asistenti virtual i biznesit "${business.name}" (${business.type}) qe komunikon me klientet ne ${channelLabel}.`,
      languageInstruction,
      "Qellimi yt eshte te ndihmosh klientin te rezervoje nje takim/vend.",
      "Mblidh gradualisht: emrin, sherbimin e deshiruar, dhe oren e preferuar.",
      strategyHint,
      "Perpara se te thrrasesh 'create_reservation', PERSERIT detajet e mbledhura dhe kerko konfirmim eksplicit nga klienti.",
      "Therrit 'create_reservation' VETEM pasi klienti te kete konfirmuar shprehimisht (p.sh. 'po', 'konfirmoj', 'ok').",
      "Nese diçka deshton ose s'je i sigurt, thuaj qe dikush nga stafi do te kontaktoje klientin.",
      `Mbaje tonin miqesor dhe te shkurter, i pershtatshem per ${channelLabel}.`,
    ].join(" ");

    return custom ? `${base}\n\nUdhezime shtese specifike per biznesin:\n${custom}` : base;
  }
}