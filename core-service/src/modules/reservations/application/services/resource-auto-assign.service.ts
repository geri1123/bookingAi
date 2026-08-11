import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { TransactionContext } from "../../../../common/domain/transaction-context";

import { ResourceFindRepository } from "../../../resources/domain/repositories/resource-find.repository";
import { ResourceErrorCode } from "../../../resources/domain/errors/resource-error-codes.enum";

import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";

// Gjen VETE nje resource (tavoline/dhome) te lire — TANI me 1 QUERY SQL
// (findFirstAvailable), jo loop+overlap-check per secilin kandidat. Kjo
// eshte KRITIKE per biznese me shume resources (50-100+): performanca
// mbetet KONSTANTE, pavaresisht sa resources ka biznesi.
@Injectable()
export class ResourceAutoAssignService {
  constructor(private readonly resourceFindRepo: ResourceFindRepository) {}

  async assign(
    businessId: string,
    startTime: Date,
    endTime: Date,
    partySize: number | undefined,
    serviceId: string | undefined,
    tx: TransactionContext,
  ): Promise<string> {
    const picked = await this.resourceFindRepo.findFirstAvailable(businessId, startTime, endTime, partySize, serviceId, tx);

    if (!picked) {
   
      throw new AppException(ReservationErrorCode.SLOT_TAKEN, { field: "resourceId" }, HttpStatus.CONFLICT);
    }

    return picked.id;
  }
}