import { Injectable, Logger } from "@nestjs/common";
import { EmailSender } from "../../domain/services/email-sender";
import { ReservationCreatedEmailPayload } from "../../domain/types/email-job.types";
import { buildReservationCreatedEmailHtml } from "../templates/reservation-created-email.template";

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
      startTime: new Date(payload.startTime).toLocaleString("sq-AL"),
    });

    const subject = `Rezervim i ri nga ${payload.customerName}`;

    // dergo NDAJ per secilin (jo CC) — nese njeri deshton, te tjeret marrin email-in normalisht
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