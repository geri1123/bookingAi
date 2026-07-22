import { Customer as PrismaCustomer, Prisma } from "@prisma/client";
import { CustomerEntity } from "../../../domain/entities/customer.entity";

export class CustomerMapper {
  static toDomain(raw: PrismaCustomer): CustomerEntity {
    return CustomerEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      name: raw.name,
      phone: raw.phone,
      email: raw.email,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: CustomerEntity): Prisma.CustomerUncheckedCreateInput {
    const props = entity.toPersistence();
    return {
      id: props.id,
      businessId: props.businessId,
      name: props.name,
      phone: props.phone,
      email: props.email,
    };
  }
}
