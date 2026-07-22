import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";

import { ResourceEntity, ResourceType } from "../../../resources/domain/entities/resource.entity";
import { ResourceFindRepository } from "../../../resources/domain/repositories/resource-find.repository";

export interface CheckResourceAvailabilityInput {
  businessId: string;
  startTime: Date;
  endTime: Date;
  partySize?: number; // p.sh. 4 veta — filtron vetem resources me capacity >= 4
  resourceType?: ResourceType; // p.sh. vetem TABLE, jo ROOM
}

@Injectable()
export class CheckResourceAvailabilityUseCase {
  constructor(
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly reservationFindRepo: ReservationFindRepository,
  ) {}

  async execute(input: CheckResourceAvailabilityInput): Promise<ResourceEntity[]> {
    if (input.startTime >= input.endTime) {
      throw new AppException(ReservationErrorCode.INVALID_TIME_RANGE, { field: "endTime" }, HttpStatus.BAD_REQUEST);
    }

    let resources = await this.resourceFindRepo.findAllByBusiness(input.businessId);

    if (input.resourceType) {
      resources = resources.filter((r) => r.type === input.resourceType);
    }

    if (input.partySize) {
      resources = resources.filter((r) => r.capacity >= input.partySize!);
    }

    // per secilin resource kandidat, kontrollo qe s'ka OVERLAP me rezervim aktiv
    const availabilityChecks = await Promise.all(
      resources.map(async (resource) => {
        const overlapping = await this.reservationFindRepo.findOverlapping({
          resourceId: resource.id,
          startTime: input.startTime,
          endTime: input.endTime,
        });
        return { resource, isFree: overlapping.length === 0 };
      }),
    );

    return availabilityChecks.filter((c) => c.isFree).map((c) => c.resource);
  }
}