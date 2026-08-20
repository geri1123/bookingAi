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

  abstract findAllByBusiness(
    businessId: string,
    from?: Date,
    to?: Date,
    limit?: number,
    offset?: number,
  ): Promise<{ reservations: ReservationEntity[]; total: number }>;

  // Rezervimet AKTIVE (jo CANCELLED/COMPLETED, ne te ardhmen) te nje klienti te caktuar —
  // perdoret p.sh. kur klienti shkruan nga WhatsApp/Instagram dhe do te ndryshoje/anuloje
  // nje rezervim ekzistues, pa ditur ID-ne e tij.
  abstract findActiveByCustomer(customerId: string, businessId: string): Promise<ReservationEntity[]>;

  abstract countActiveByCustomer(customerId: string, businessId: string, tx?: TransactionContext): Promise<number>;

  // Rezervime CONFIRMED qe endTime u ka kaluar - per cron-in qe i shenon
  // automatikisht COMPLETED (check-out ka ndodhur).
  abstract findConfirmedEndingBefore(date: Date): Promise<ReservationEntity[]>;

  // Kush eshte "ende mysafir" NE KETE MOMENT (startTime <= at <= endTime) -
  // ndryshe nga findAllByBusiness (qe filtron sipas startTime), kjo kap
  // sakte edhe qendrime shume-ditore te filluara me pare (hotel).
  abstract findCurrentlyActive(businessId: string, at: Date): Promise<ReservationEntity[]>;

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