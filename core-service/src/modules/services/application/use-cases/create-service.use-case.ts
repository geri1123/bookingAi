import { Injectable } from "@nestjs/common";
import { ServiceEntity, ServicePricingUnit } from "../../domain/entities/service.entity";
import { ServiceCreateRepository } from "../../domain/repositories/service-create.repository";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer"; // I RI — global, s'kerkon import module
import { EventName } from "../../../../common/events/event-name.enum"; // I RI

export interface CreateServiceInput {
  businessId: string;
  name: string;
  description?: string;
  pricingUnit: ServicePricingUnit;
  duration?: number;
  price: number;
}

@Injectable()
export class CreateServiceUseCase {
  constructor(
    private readonly serviceCreateRepo: ServiceCreateRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CreateServiceInput): Promise<ServiceEntity> {
    const service = ServiceEntity.create(input);
    const created = await this.serviceCreateRepo.create(service);

    await this.outboxWriter.write(EventName.SERVICE_CREATED, service.id, {
      businessId: service.businessId,
      serviceId: service.id,
    });

    return created;
  }
}