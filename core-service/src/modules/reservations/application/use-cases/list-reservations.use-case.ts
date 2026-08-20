import { Injectable } from "@nestjs/common";
import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";

export interface ListReservationsInput {
  businessId: string;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

export interface ListReservationsResult {
  reservations: ReservationEntity[];
  total: number;
}

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

@Injectable()
export class ListReservationsUseCase {
  constructor(private readonly reservationFindRepo: ReservationFindRepository) {}

  async execute(input: ListReservationsInput): Promise<ListReservationsResult> {
    const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
    const offset = Math.max(input.offset ?? 0, 0);

    
    let { from, to } = input;
    if (!from && !to) {
      const now = new Date();
      from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
      to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));
    }

    const { reservations, total } = await this.reservationFindRepo.findAllByBusiness(
      input.businessId,
      from,
      to,
      limit,
      offset,
    );

    return { reservations, total };
  }
}
