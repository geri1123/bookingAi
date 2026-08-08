import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../../../config/config.service";
import { CommunicationChannel, ConversationRepository } from "../domain/repositories/conversation.repository";
import { AiSettingsRepository } from "../domain/repositories/ai-settings.repository";
import { BookingIntentRepository } from "../domain/repositories/booking-intent.repository";
import { CoreServiceClient, CoreServiceError, BusinessInfo } from "../infrastructure/http/core-service.client";
import {
  AnthropicClient,
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
    private readonly anthropicClient: AnthropicClient,
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

      if (name === "find_customer_reservations") {
        const phone = (toolInput.phone as string | undefined) ?? (input.channel === "WHATSAPP" ? input.customerExternalId : undefined);
        if (!phone) {
          return JSON.stringify({ success: false, error: "Numri i telefonit mungon." });
        }
        const result = await this.coreServiceClient.findCustomerReservations({
          businessId: input.businessId,
          phone,
        });
        return JSON.stringify(result);
      }

      if (name === "reschedule_reservation") {
        const phone = (toolInput.phone as string | undefined) ?? (input.channel === "WHATSAPP" ? input.customerExternalId : undefined);
        if (!phone) {
          return JSON.stringify({ success: false, error: "Numri i telefonit mungon — kerkoji klientit ta japi." });
        }
        try {
          const result = await this.coreServiceClient.rescheduleReservation({
            businessId: input.businessId,
            reservationId: toolInput.reservationId as string,
            phone,
            startTime: toolInput.startTime as string,
            endTime: toolInput.endTime as string | undefined,
          });
          return JSON.stringify({ success: true, reservation: result?.reservation });
        } catch (err) {
          const message = err instanceof CoreServiceError ? JSON.stringify(err.body) : String(err);
          return JSON.stringify({ success: false, error: message });
        }
      }

      if (name === "cancel_reservation") {
        const phone = (toolInput.phone as string | undefined) ?? (input.channel === "WHATSAPP" ? input.customerExternalId : undefined);
        if (!phone) {
          return JSON.stringify({ success: false, error: "Numri i telefonit mungon — kerkoji klientit ta japi." });
        }
        try {
          const result = await this.coreServiceClient.cancelReservation({
            businessId: input.businessId,
            reservationId: toolInput.reservationId as string,
            phone,
          });
          return JSON.stringify({ success: true, reservation: result?.reservation });
        } catch (err) {
          const message = err instanceof CoreServiceError ? JSON.stringify(err.body) : String(err);
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


  private getUtcOffsetMinutes(date: Date, timeZone: string): number {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = dtf.formatToParts(date);
    const map: Record<string, string> = {};
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = p.value;
    }
    const hour = map.hour === "24" ? "0" : map.hour;
    const asUtc = Date.UTC(
      Number(map.year),
      Number(map.month) - 1,
      Number(map.day),
      Number(hour),
      Number(map.minute),
      Number(map.second),
    );
    return Math.round((asUtc - date.getTime()) / 60_000);
  }

  // Kthen offset-in ne formatin "+02:00" / "-05:00", gati per t'u bashkangjitur ne nje ISO string.
  private formatUtcOffset(offsetMinutes: number): string {
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMinutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, "0");
    const minutes = String(abs % 60).padStart(2, "0");
    return `${sign}${hours}:${minutes}`;
  }
private buildSystemPrompt(
    business: BusinessInfo,
    custom: string | null | undefined,
    channel: CommunicationChannel,
  ): string {
    const fallbackLang = business.language ?? this.appConfig.defaultLanguage;
    const channelLabel = this.channelLabel(channel);

  
    const now = new Date();
    const timezone = business.timezone || "UTC";
    const utcOffsetMinutes = this.getUtcOffsetMinutes(now, timezone);
    const utcOffsetString = this.formatUtcOffset(utcOffsetMinutes);
    const localNowIso = new Date(now.getTime() + utcOffsetMinutes * 60_000)
      .toISOString()
      .slice(0, 19);
    const todayIso = localNowIso.slice(0, 10);
    const dateTimeInstruction = `Data dhe ora aktuale LOKALE e biznesit (timezone: ${timezone}) eshte: ${localNowIso} (dita: ${todayIso}, offset nga UTC: ${utcOffsetString}). Kjo eshte referenca e vetme e sakte per "sot", "nesër", "ora 9", etj. Perdor GJITHMONE kete si baze per te llogaritur cdo date/ore relative qe permend klienti. Mos hamendëso vitin apo daten nga njohuri te tjera. Kur klienti permend nje ore, konvertoje sakte ne 24-oresh: p.sh. "9 e mbasdites"/"9 e mbremjes" = 21:00, "9 e mengjesit" = 09:00. Nese klienti thote vetem "ne 9" pa specifikuar mengjes/mbasdite dhe konteksti s'e ben te qarte, PYETE per sqarim para se te vazhdosh. KUR THERRET nje tool (check_availability, check_resource_availability, create_reservation, reschedule_reservation), startTime/endTime DUHET te jene ne formatin ISO 8601 ME OFFSET-IN E SAKTE te bashkangjitur GJITHMONE, p.sh. "2026-08-08T21:00:00${utcOffsetString}" — MOS e lësh kurrë pa offset dhe MOS perdor 'Z' (UTC) nese s'eshte eksplicitisht kerkuar.`;

    const managementInstruction = [
      "Klienti mund te te kerkoje GJITHASHTU te NDRYSHOJE oren e nje rezervimi ekzistues ose ta ANULLOJE fare.",
      channel === "WHATSAPP"
        ? "Meqe biseda eshte ne WhatsApp, numri i telefonit i klientit eshte VETE kanali i bisedes — s'ka pse ta pyesesh perseri, perdore direkt."
        : "KUJDES: biseda eshte ne " + channelLabel + ", KU ID-JA E KLIENTIT S'ESHTE NUMER TELEFONI (eshte ID e brendshme e platformes). Prandaj DUHET DOMOSDOSHMERISHT te pyesesh klientin per numrin e telefonit qe perdori kur beri rezervimin FILLESTARE, PARA se te therrasesh 'find_customer_reservations' — mos u perpiq ta hamendesosh ose ta lesh bosh.",
      "Therrit GJITHMONE PARA se gjithash 'find_customer_reservations' me numrin e telefonit te klientit, per te gjetur rezervimet e tij aktive.",
      "Nese s'gjendet asnje rezervim, thuaji klientit qarte dhe mos vazhdo.",
      "Nese gjendet me shume se 1 rezervim, PERSHKRUAJI te gjitha shkurt (sherbimi + data/ora) dhe pyet klientin CILIN ka fjala, para se te vazhdosh.",
      "Nese gjendet vetem 1, PERSERIT detajet e tij (sherbimi, data/ora aktuale) dhe kerko konfirmim eksplicit qe eshte ai i sakti para se te vazhdosh.",
      "Per te NDRYSHUAR oren: PYETE klientin SHPREHIMISHT per oren e re qe deshiron (nese ende s'e ka thene qarte) — MOS perdor kurre oren AKTUALE te rezervimit si 'startTime' i ri, sepse kjo s'do te ishte ndryshim fare. Pasi ke oren e re (e ndryshme nga ajo aktuale), PERSERITE dhe kerko konfirmim eksplicit ('po', 'konfirmoj'), pastaj therrit DIREKT 'reschedule_reservation' me reservationId-ne e sakte te gjetur me pare DHE startTime-in E RI qe klienti kerkoi (jo te vjetrin).",
      "KUJDES: MOS perdor 'check_availability' apo 'check_resource_availability' PER TE KONTROLLUAR oren e re GJATE nje ndryshimi rezervimi — keto mjete s'e dine qe rezervimi EKZISTUES i klientit duhet PERJASHTUAR nga kontrolli, dhe mund te thone gabimisht 's'ka vend te lire' kur ne fakt vendi eshte i zene vetem nga rezervimi i tij i VJETER qe po zevendesohet. 'reschedule_reservation' e ben vete kete kontroll SAKTE (duke perjashtuar rezervimin qe po ndryshohet) — thirre direkt dhe nese kthen gabim 'SLOT_TAKEN', VETEM ATEHERE informoje klientin qe ora e re s'eshte e lire dhe kerko nje alternative.",
      "Per te ANULLUAR: kerko konfirmim eksplicit qe klienti VERTET deshiron anullimin (jo vetem 'mund ta anulloj?'), pastaj therrit 'cancel_reservation' me reservationId-ne e sakte.",
      "MOS therrit kurre 'reschedule_reservation' ose 'cancel_reservation' pa e gjetur me pare reservationId-ne real permes 'find_customer_reservations' ne kete bisede — mos e hamendeso ID-ne.",
    ].join(" ");

    
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
      dateTimeInstruction,
      languageInstruction,
      "Qellimi yt eshte te ndihmosh klientin te rezervoje nje takim/vend.",
      "Mblidh gradualisht: emrin, sherbimin e deshiruar, dhe oren e preferuar.",
      strategyHint,
      "Perpara se te thrrasesh 'create_reservation', PERSERIT detajet e mbledhura dhe kerko konfirmim eksplicit nga klienti.",
      "Therrit 'create_reservation' VETEM pasi klienti te kete konfirmuar shprehimisht (p.sh. 'po', 'konfirmoj', 'ok').",
      managementInstruction,
      "Nese diçka deshton ose s'je i sigurt, thuaj qe dikush nga stafi do te kontaktoje klientin.",
      `Mbaje tonin miqesor dhe te shkurter, i pershtatshem per ${channelLabel}.`,
    ].join(" ");

    return custom ? `${base}\n\nUdhezime shtese specifike per biznesin:\n${custom}` : base;
  }
}