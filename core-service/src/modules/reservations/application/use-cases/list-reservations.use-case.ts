import { Injectable } from "@nestjs/common";
import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";

export interface ListReservationsInput {
  businessId: string;
  from?: Date;
  to?: Date;
}

@Injectable()
export class ListReservationsUseCase {
  constructor(private readonly reservationFindRepo: ReservationFindRepository) {}

  async execute(input: ListReservationsInput): Promise<ReservationEntity[]> {
    return this.reservationFindRepo.findAllByBusiness(input.businessId, input.from, input.to);
  }
}
