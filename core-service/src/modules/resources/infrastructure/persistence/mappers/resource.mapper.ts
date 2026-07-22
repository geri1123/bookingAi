import { Resource as PrismaResource, Prisma } from "@prisma/client";
import { ResourceEntity, ResourceType } from "../../../domain/entities/resource.entity";

export class ResourceMapper {
  static toDomain(raw: PrismaResource): ResourceEntity {
    return ResourceEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      name: raw.name,
      type: raw.type as ResourceType,
      capacity: raw.capacity,
    });
  }

  static toPersistence(entity: ResourceEntity): Prisma.ResourceUncheckedCreateInput {
    const props = entity.toPersistence();
    return {
      id: props.id,
      businessId: props.businessId,
      name: props.name,
      type: props.type,
      capacity: props.capacity,
    };
  }
}
