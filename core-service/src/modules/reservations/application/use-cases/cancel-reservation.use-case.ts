import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";
import { ReservationUpdateRepository } from "../../domain/repositories/reservation-update.repository";
import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

import { CustomerFindRepository } from "../../../customers/domain/repositories/customer-find.repository";
import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { NotificationRecipientsService } from "../services/notification-recipients.service";

export interface CancelReservationInput {
  reservationId: string;
  businessId: string;
 
  phone?: string;
}

@Injectable()
export class CancelReservationUseCase {
  constructor(
    private readonly reservationFindRepo: ReservationFindRepository,
    private readonly reservationUpdateRepo: ReservationUpdateRepository,
    private readonly customerFindRepo: CustomerFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly notificationRecipients: NotificationRecipientsService,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CancelReservationInput): Promise<ReservationEntity> {
    const reservation = await this.reservationFindRepo.findById(input.reservationId);

    if (!reservation || reservation.businessId !== input.businessId) {
      throw new AppException(ReservationErrorCode.NOT_FOUND, { field: "reservationId" }, HttpStatus.NOT_FOUND);
    }

    const customer = await this.customerFindRepo.findById(reservation.customerId);
    if (input.phone && (!customer || customer.phone !== input.phone)) {
      throw new AppException(ReservationErrorCode.NOT_FOUND, { field: "reservationId" }, HttpStatus.NOT_FOUND);
    }

    reservation.cancel();

    const updated = await this.reservationUpdateRepo.update(reservation);

    const service = updated.serviceId ? await this.serviceFindRepo.findById(updated.serviceId) : null;
    const business = await this.businessFindRepo.findById(input.businessId);
    const notificationEmails = await this.notificationRecipients.resolveNotificationEmails(input.businessId);

    await this.outboxWriter.write(EventName.RESERVATION_CANCELLED, updated.id, {
      reservationId: updated.id,
      businessId: input.businessId,
      businessName: business?.name ?? "",
      notificationEmails,
      customerId: updated.customerId,
      customerName: customer?.name ?? "",
      customerPhone: customer?.phone ?? "",
      serviceName: service?.name ?? "",
      startTime: updated.startTime,
      endTime: updated.endTime,
      businessTimezone: business?.timezone ?? "UTC",
    });

    return updated;
  }
}
