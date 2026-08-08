import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";
import { ReservationUpdateRepository } from "../../domain/repositories/reservation-update.repository";

import { CustomerFindRepository } from "../../../customers/domain/repositories/customer-find.repository";
import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";

import { WorkingHoursCheckerService } from "../services/working-hours-checker.service";
import { NotificationRecipientsService } from "../services/notification-recipients.service";

export interface RescheduleReservationInput {
  reservationId: string;
  businessId: string;
  phone?: string;
  startTime: Date;
  endTime?: Date;
}

@Injectable()
export class RescheduleReservationUseCase {
  constructor(
    private readonly reservationFindRepo: ReservationFindRepository,
    private readonly reservationUpdateRepo: ReservationUpdateRepository,
    private readonly customerFindRepo: CustomerFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly workingHoursChecker: WorkingHoursCheckerService,
    private readonly notificationRecipients: NotificationRecipientsService,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: RescheduleReservationInput): Promise<ReservationEntity> {
    const reservation = await this.reservationFindRepo.findById(input.reservationId);
    if (!reservation || reservation.businessId !== input.businessId) {
      throw new AppException(ReservationErrorCode.NOT_FOUND, { field: "reservationId" }, HttpStatus.NOT_FOUND);
    }

    const customer = await this.customerFindRepo.findById(reservation.customerId);
    if (input.phone && (!customer || customer.phone !== input.phone)) {
      throw new AppException(ReservationErrorCode.NOT_FOUND, { field: "reservationId" }, HttpStatus.NOT_FOUND);
    }

    const service = reservation.serviceId ? await this.serviceFindRepo.findById(reservation.serviceId) : null;
    const business = await this.businessFindRepo.findById(input.businessId);

    const originalDurationMs = reservation.endTime.getTime() - reservation.startTime.getTime();
    const newEndTime =
      input.endTime ??
      (service?.duration
        ? new Date(input.startTime.getTime() + service.duration * 60_000)
        : new Date(input.startTime.getTime() + originalDurationMs));
    if (
      input.startTime.getTime() === reservation.startTime.getTime() &&
      newEndTime.getTime() === reservation.endTime.getTime()
    ) {
      throw new AppException(
        ReservationErrorCode.SAME_TIME_AS_CURRENT,
        { field: "startTime" },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (reservation.employeeId || reservation.resourceId) {
      const overlapping = await this.reservationFindRepo.findOverlapping({
        employeeId: reservation.employeeId,
        resourceId: reservation.resourceId,
        startTime: input.startTime,
        endTime: newEndTime,
      });
      if (overlapping.some((r) => r.id !== reservation.id)) {
        throw new AppException(ReservationErrorCode.SLOT_TAKEN, { field: "startTime" }, HttpStatus.CONFLICT);
      }
    }

    if (reservation.employeeId && business) {
      const withinHours = await this.workingHoursChecker.isWithinWorkingHours(
        reservation.employeeId,
        input.startTime,
        newEndTime,
        business.timezone,
      );
      if (!withinHours) {
        throw new AppException(ReservationErrorCode.OUTSIDE_WORKING_HOURS, { field: "startTime" }, HttpStatus.CONFLICT);
      }
    }

    const previousStartTime = reservation.startTime;
    const previousEndTime = reservation.endTime;

    reservation.reschedule(input.startTime, newEndTime);
    const updated = await this.reservationUpdateRepo.update(reservation);

    const notificationEmails = await this.notificationRecipients.resolveNotificationEmails(input.businessId);

    await this.outboxWriter.write(EventName.RESERVATION_RESCHEDULED, updated.id, {
      reservationId: updated.id,
      businessId: input.businessId,
      businessName: business?.name ?? "",
      notificationEmails,
      customerName: customer?.name ?? "",
      customerPhone: customer?.phone ?? "",
      serviceName: service?.name ?? "",
      previousStartTime,
      previousEndTime,
      startTime: updated.startTime,
      endTime: updated.endTime,
      businessTimezone: business?.timezone ?? "UTC",
    });

    return updated;
  }
}