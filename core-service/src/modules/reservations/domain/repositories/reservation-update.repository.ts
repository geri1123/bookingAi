import { ReservationEntity } from "../entities/reservation.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export abstract class ReservationUpdateRepository {
  abstract update(reservation: ReservationEntity, tx?: TransactionContext): Promise<ReservationEntity>;
}
