import { Injectable } from "@nestjs/common";
import { ResourceEntity, ResourceType } from "../../domain/entities/resource.entity";
import { ResourceCreateRepository } from "../../domain/repositories/resource-create.repository";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface CreateResourceInput {
  businessId: string;
  name: string;
  type: ResourceType;
  capacity: number;
}

@Injectable()
export class CreateResourceUseCase {
  constructor(
    private readonly resourceCreateRepo: ResourceCreateRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CreateResourceInput): Promise<ResourceEntity> {
    const resource = ResourceEntity.create(input);
    const created = await this.resourceCreateRepo.create(resource);

    await this.outboxWriter.write(EventName.RESOURCE_CREATED, resource.id, {
      businessId: resource.businessId,
      resourceId: resource.id,
    });

    return created;
  }
}
