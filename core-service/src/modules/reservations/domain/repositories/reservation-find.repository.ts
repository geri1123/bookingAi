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

  // per krijim rezervimi: a ka nje rezervim AKTIV (jo CANCELLED) qe perputhet
  // ne kohe me employeeId/resourceId te dhene. tx OPSIONAL — kur jepet, lexon
  // BRENDA te njejtes transaksion (per konsistence me advisory lock).
  abstract findOverlapping(query: OverlapQuery, tx?: TransactionContext): Promise<ReservationEntity[]>;

  // per CheckAvailabilityUseCase: te gjitha rezervimet aktive te nje employee-i
  // brenda nje dite/intervali, per te zbritur slotet e zena nga oraret e lira
  abstract findActiveByEmployeeBetween(employeeId: string, from: Date, to: Date): Promise<ReservationEntity[]>;

  abstract findAllByBusiness(businessId: string, from?: Date, to?: Date): Promise<ReservationEntity[]>;
}