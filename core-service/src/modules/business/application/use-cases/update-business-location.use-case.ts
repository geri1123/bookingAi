import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { BusinessUpdateRepository } from "../../domain/repositories/business-update.repositoy";
import { BusinessErrorCode } from "../../domain/errors/business-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface UpdateBusinessLocationInput {
  businessId: string;
  latitude: number;
  longitude: number;
}

@Injectable()
export class UpdateBusinessLocationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly businessUpdateRepo: BusinessUpdateRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: UpdateBusinessLocationInput): Promise<void> {
    const business = await this.businessFindRepo.findById(input.businessId);
    if (!business) {
      throw new AppException(BusinessErrorCode.NOT_FOUND, { businessId: input.businessId }, HttpStatus.NOT_FOUND);
    }

    business.updateLocation(input.latitude, input.longitude);

    await this.prisma.$transaction(async (tx) => {
      await this.businessUpdateRepo.update(business, tx);

      await this.outboxWriter.write(
        EventName.BUSINESS_LOCATION_UPDATED,
        business.id,
        {
          businessId: business.id,
          latitude: input.latitude,
          longitude: input.longitude,
        },
        tx,
      );
    });
  }
}