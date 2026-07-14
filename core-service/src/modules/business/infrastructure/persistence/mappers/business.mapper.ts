// src/modules/business/infrastructure/persistence/mappers/business.mapper.ts
import { Business as PrismaBusiness } from "@prisma/client";
import { BusinessEntity } from "../../../domain/entities/business.entity";

export class BusinessMapper {
  static toDomain(raw: PrismaBusiness): BusinessEntity {
    return BusinessEntity.reconstitute({
      id: raw.id,
      name: raw.name,
      type: raw.type as any,
      phone: raw.phone,
      email: raw.email,
      address: raw.address,
      language: raw.language as any,
      status: raw.status as any,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: BusinessEntity) {
    return { ...entity.toPersistence() };
  }
}