import { ReservationEntity } from "../entities/reservation.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ReservationCreateRepository {
  abstract create(reservation: ReservationEntity, tx?: TransactionContext): Promise<ReservationEntity>;
}
