import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { TransactionContext } from "../../../../common/domain/transaction-context";
import { toHHMM, dayOfWeekOf } from "../../../../common/utils/time";

import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";


@Injectable()
export class EmployeeAutoAssignService {
  constructor(private readonly reservationFindRepo: ReservationFindRepository) {}

  async assign(businessId: string, startTime: Date, endTime: Date, tx: TransactionContext): Promise<string> {
    const employeeId = await this.reservationFindRepo.findFirstAvailableEmployee(
      businessId,
      dayOfWeekOf(startTime),
      toHHMM(startTime),
      toHHMM(endTime),
      startTime,
      endTime,
      tx,
    );

    if (!employeeId) {
      throw new AppException(ReservationErrorCode.SLOT_TAKEN, { field: "startTime" }, HttpStatus.CONFLICT);
    }

    return employeeId;
  }
}