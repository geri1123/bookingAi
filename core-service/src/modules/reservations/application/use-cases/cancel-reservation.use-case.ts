import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";
import { ReservationUpdateRepository } from "../../domain/repositories/reservation-update.repository";
import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface CancelReservationInput {
  reservationId: string;
  businessId: string;
}

@Injectable()
export class CancelReservationUseCase {
  constructor(
    private readonly reservationFindRepo: ReservationFindRepository,
    private readonly reservationUpdateRepo: ReservationUpdateRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CancelReservationInput): Promise<ReservationEntity> {
    const reservation = await this.reservationFindRepo.findById(input.reservationId);

    if (!reservation || reservation.businessId !== input.businessId) {
      throw new AppException(ReservationErrorCode.NOT_FOUND, { field: "reservationId" }, HttpStatus.NOT_FOUND);
    }

    reservation.cancel(); 

    const updated = await this.reservationUpdateRepo.update(reservation);

    await this.outboxWriter.write(EventName.RESERVATION_CANCELLED, updated.id, {
      reservationId: updated.id,
      businessId: input.businessId,
      customerId: updated.customerId,
    });

    return updated;
  }
}
