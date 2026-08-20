import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";
import { ReservationUpdateRepository } from "../../domain/repositories/reservation-update.repository";


@Injectable()
export class ReservationCompletionCheckerService {
  private readonly logger = new Logger(ReservationCompletionCheckerService.name);

  constructor(
    private readonly reservationFindRepo: ReservationFindRepository,
    private readonly reservationUpdateRepo: ReservationUpdateRepository,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async completeEndedReservations(): Promise<void> {
    const now = new Date();
    const ended = await this.reservationFindRepo.findConfirmedEndingBefore(now);
    if (ended.length === 0) return;

    let completedCount = 0;
    for (const reservation of ended) {
      try {
        reservation.complete();
        await this.reservationUpdateRepo.update(reservation);
        completedCount++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Deshtoi completimi i rezervimit ${reservation.id}: ${message}`);
      }
    }

    this.logger.log(`Completuar automatikisht ${completedCount}/${ended.length} rezervime te perfunduara.`);
  }
}
