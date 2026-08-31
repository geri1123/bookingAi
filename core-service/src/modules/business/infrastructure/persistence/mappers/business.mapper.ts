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
      profileImageUrl: raw.profileImageUrl,
      profileImagePublicId: raw.profileImagePublicId,
      latitude: raw.latitude,
      longitude: raw.longitude,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      timezone:raw.timezone,
    });
  }

  static toPersistence(entity: BusinessEntity) {
    return { ...entity.toPersistence() };
  }

  // Perdoret nga controllerat per response te API - jo toPersistence().
  // Perjashton fusha interne si profileImagePublicId (Cloudinary).
  static toResponse(entity: BusinessEntity) {
    const props = entity.toPersistence();
    return {
      id: props.id,
      name: props.name,
      type: props.type,
      phone: props.phone,
      email: props.email,
      address: props.address,
      language: props.language,
      status: props.status,
      profileImageUrl: props.profileImageUrl,
      latitude: props.latitude,
      longitude: props.longitude,
      timezone: props.timezone,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}