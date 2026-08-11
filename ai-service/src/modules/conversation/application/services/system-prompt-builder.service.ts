import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { CommunicationChannel } from "../../domain/repositories/conversation.repository";
import { BusinessInfo, ServiceInfo } from "../../infrastructure/http/core-service.client";
import { getUtcOffsetMinutes, formatUtcOffset } from "../utils/timezone.util";

@Injectable()
export class SystemPromptBuilderService {
  constructor(private readonly appConfig: AppConfigService) {}

  channelLabel(channel: CommunicationChannel): string {
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

  build(
    business: BusinessInfo,
    custom: string | null | undefined,
    channel: CommunicationChannel,
    services: ServiceInfo[],
  ): string {
    const fallbackLang = business.language ?? this.appConfig.defaultLanguage;
    const channelLabel = this.channelLabel(channel);

  
    const now = new Date();
    const timezone = business.timezone || "UTC";
    const utcOffsetMinutes = getUtcOffsetMinutes(now, timezone);
    const utcOffsetString = formatUtcOffset(utcOffsetMinutes);
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
      ? "Perdor 'check_resource_availability' me startTime = data e check-in dhe endTime = data e check-out (jo ore, DATA te plota) per te gjetur dhoma te lira. Perpara 'create_reservation' konfirmo domosdo NUMRIN E NETEVE me klientin, dhe dergo: startTime SAKTE si daten e check-in ME OREN 14:00 (ora standarde e check-in-it), dhe endTime SAKTE si daten e check-out ME OREN 10:00 (ora standarde e checkout-it) — p.sh. nese klienti mberrin me 11.08.2026 dhe largohet me 14.08.2026, startTime = '2026-08-11T14:00:00' dhe endTime = '2026-08-14T10:00:00' (te dyja me offset-in e sakte). MOS i le kurre me ore 00:00 — kjo do te thote gabimisht se dhoma zihet/lirohet ne mesnate, jo ne oret reale te check-in/check-out."
      : business.needsEmployee
        ? "Perdor 'check_availability' per te propozuar ore te lira reale sipas punonjesit, jo te shpikura."
        : business.needsResource
          ? "Perdor 'check_resource_availability' per te propozuar ore te lira reale sipas tavolines/dhomes (merr parasysh partySize), jo te shpikura."
          : "Ky biznes s'ka kontroll disponueshmerie — pasi klienti konfirmon oren e deshiruar, mund te thrrasesh direkt 'create_reservation'.";

    const pricingUnitLabel = (unit: string): string => {
      if (unit === "PER_NIGHT") return "per nate";
      if (unit === "PER_HOUR") return "per ore";
      return "";
    };

    const pricingInstruction = services.length > 0
      ? "CMIMET e sherbimeve (perdori kur klienti pyet 'sa kushton' ose gjate konfirmimit final): " +
        services
          .map((s) => `"${s.name}" = ${s.price}${pricingUnitLabel(s.pricingUnit) ? " " + pricingUnitLabel(s.pricingUnit) : ""}`)
          .join(", ") +
        ". Perdor VETEM keto cmime, MOS i shpik apo i hamendeso kurre. Nese klienti pyet per cmimin e nje sherbimi qe s'eshte ne kete liste, thuaj qe s'e ke kete informacion dhe qe dikush nga stafi do ta konfirmoje."
      : "Ky biznes s'ka ende cmime te konfiguruara per sherbimet e tij — nese klienti pyet per cmimin, thuaj qe dikush nga stafi do ta konfirmoje, MOS hamendëso asnjë shifer.";

    const base = [
      `Je asistenti virtual i biznesit "${business.name}" (${business.type}) qe komunikon me klientet ne ${channelLabel}.`,
      dateTimeInstruction,
      languageInstruction,
      "Qellimi yt eshte te ndihmosh klientin te rezervoje nje takim/vend.",
      "Mblidh gradualisht: emrin, sherbimin e deshiruar, dhe oren e preferuar.",
      strategyHint,
      pricingInstruction,
      "Perpara se te thrrasesh 'create_reservation', PERSERIT detajet e mbledhura dhe kerko konfirmim eksplicit nga klienti.",
      "Therrit 'create_reservation' VETEM pasi klienti te kete konfirmuar shprehimisht (p.sh. 'po', 'konfirmoj', 'ok').",
      managementInstruction,
      "Nese diçka deshton ose s'je i sigurt, thuaj qe dikush nga stafi do te kontaktoje klientin.",
      `Mbaje tonin miqesor dhe te shkurter, i pershtatshem per ${channelLabel}.`,
    ].join(" ");

    return custom ? `${base}\n\nUdhezime shtese specifike per biznesin:\n${custom}` : base;
  }
}