import { Injectable, HttpStatus } from "@nestjs/common";
import { ServiceEntity, ServicePricingUnit } from "../../domain/entities/service.entity";
import { ServiceCreateRepository } from "../../domain/repositories/service-create.repository";
import { ServiceFindRepository } from "../../domain/repositories/service-find.repository";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ServiceErrorCode } from "../../domain/errors/service-error-codes.enum";

const MAX_SERVICES_PER_BUSINESS = 20;

export interface CreateServiceInput {
  businessId: string;
  name: string;
  description?: string;
  pricingUnit: ServicePricingUnit;
  duration?: number;
  price?: number;
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private readonly serviceCreateRepo: ServiceCreateRepository,
    private readonly serviceFindRepo: ServiceFindRepository, // I RI - per countByBusiness
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CreateServiceInput): Promise<ServiceEntity> {
    const count = await this.serviceFindRepo.countByBusiness(input.businessId);

    if (count >= MAX_SERVICES_PER_BUSINESS) {
      throw new AppException(
        ServiceErrorCode.MAX_SERVICES_REACHED,
        { field: "businessId", max: MAX_SERVICES_PER_BUSINESS },
        HttpStatus.BAD_REQUEST,
      );
    }

    const service = ServiceEntity.create(input);
    const created = await this.serviceCreateRepo.create(service);

    await this.outboxWriter.write(EventName.SERVICE_CREATED, service.id, {
      businessId: service.businessId,
      serviceId: service.id,
    });

    return created;
  }
}