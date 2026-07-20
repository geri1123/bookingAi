import { Service as PrismaService, ServicePricingUnit as PrismaServicePricingUnit, Prisma } from "@prisma/client";
import { ServiceEntity, ServicePricingUnit } from "../../../domain/entities/service.entity";

function toDomainPricingUnit(unit: PrismaServicePricingUnit): ServicePricingUnit {
  return ServicePricingUnit[unit];
}

function toPrismaPricingUnit(unit: ServicePricingUnit): PrismaServicePricingUnit {
  return unit as PrismaServicePricingUnit;
}

export class ServiceMapper {
  static toDomain(raw: PrismaService): ServiceEntity {
  return ServiceEntity.reconstitute({
    id: raw.id,
    businessId: raw.businessId,
    name: raw.name,
    description: raw.description,
    duration: raw.duration,
    pricingUnit: toDomainPricingUnit(raw.pricingUnit),
    price: raw.price.toNumber(),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt, 
  });
  }

  static toPersistence(entity: ServiceEntity): Prisma.ServiceUncheckedCreateInput {
    const props = entity.toPersistence();
    return {
      id: props.id,
      businessId: props.businessId,
      name: props.name,
      description: props.description,
      duration: props.duration,
      pricingUnit: toPrismaPricingUnit(props.pricingUnit),
      price: props.price,
    };
  }
}