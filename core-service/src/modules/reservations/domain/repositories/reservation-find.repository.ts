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

  // Rezervimet AKTIVE (jo CANCELLED/COMPLETED, ne te ardhmen) te nje klienti te caktuar —
  // perdoret p.sh. kur klienti shkruan nga WhatsApp/Instagram dhe do te ndryshoje/anuloje
  // nje rezervim ekzistues, pa ditur ID-ne e tij.
  abstract findActiveByCustomer(customerId: string, businessId: string): Promise<ReservationEntity[]>;

  abstract countActiveByCustomer(customerId: string, businessId: string, tx?: TransactionContext): Promise<number>;

  // Gjen 1 EMPLOYEE te lire direkt me 1 query SQL 
  
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