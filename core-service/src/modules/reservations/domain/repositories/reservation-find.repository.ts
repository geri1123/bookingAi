import { ReservationEntity } from "../entities/reservation.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export interface OverlapQuery {
  employeeId?: string | null;
  resourceId?: string | null;
  startTime: Date;
  endTime: Date;
}

export abstract class ReservationFindRepository {
  abstract findById(id: string): Promise<ReservationEntity | null>;

  abstract findOverlapping(query: OverlapQuery, tx?: TransactionContext): Promise<ReservationEntity[]>;

  abstract findActiveByEmployeeBetween(employeeId: string, from: Date, to: Date): Promise<ReservationEntity[]>;

  abstract findAllByBusiness(businessId: string, from?: Date, to?: Date): Promise<ReservationEntity[]>;

  abstract countActiveByCustomer(customerId: string, businessId: string, tx?: TransactionContext): Promise<number>;

  // Gjen 1 EMPLOYEE te lire direkt me 1 query SQL — kombinon DY kushte
  // (brenda Schedule DHE pa overlap me Reservation) ne nje query te vetem,
  // ne vend qe aplikacioni te loop-oje employee pas employee. Kritike per
  // biznese me shume employees (20-50+). Kthen null nese ASNJE s'eshte i lire.
  abstract findFirstAvailableEmployee(
    businessId: string,
    dayOfWeek: number,
    scheduleStartHHMM: string,
    scheduleEndHHMM: string,
    reservationStartTime: Date,
    reservationEndTime: Date,
    tx?: TransactionContext,
  ): Promise<string | null>;
}