import { Injectable, Logger } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { ReservationCreatedEmailPayload } from "../../domain/types/email-job.types";
import { buildReservationCreatedEmailHtml } from "../templates/reservation-created-email.template";

function formatDateTimeNumeric(isoDate: string, businessTimezone: string | undefined): string {
  const timeZone = businessTimezone ?? "UTC";
  const date = new Date(isoDate);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  return `${get("day")}.${get("month")}.${get("year")} ${get("hour")}:${get("minute")}`;
}

@Injectable()
export class SendReservationCreatedEmailHandler {
  private readonly logger = new Logger(SendReservationCreatedEmailHandler.name);

  constructor(private readonly emailSender: EmailSender) {}

  async handle(payload: ReservationCreatedEmailPayload): Promise<void> {
    if (!payload.notificationEmails || payload.notificationEmails.length === 0) {
      this.logger.warn(`Reservation ${payload.reservationId}: s'ka njeri per me njoftu, u anashkalua.`);
      return;
    }

    const html = buildReservationCreatedEmailHtml({
      businessName: payload.businessName,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      serviceName: payload.serviceName,
      startTime: formatDateTimeNumeric(payload.startTime, payload.businessTimezone),
      endTime: payload.endTime ? formatDateTimeNumeric(payload.endTime, payload.businessTimezone) : undefined,
    });

    const subject = `Rezervim i ri nga ${payload.customerName}`;

    const results = await Promise.allSettled(
      payload.notificationEmails.map((to) => this.emailSender.send({ to, subject, html })),
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        this.logger.error(
          `Deshtoi dergimi tek ${payload.notificationEmails[index]} per reservation ${payload.reservationId}: ${result.reason}`,
        );
      }
    });
  }
}