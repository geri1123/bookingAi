import { Employee as PrismaEmployee, Prisma } from "@prisma/client";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";

export class EmployeeMapper {
  static toDomain(raw: PrismaEmployee): EmployeeEntity {
    return EmployeeEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      name: raw.name,
      phone: raw.phone,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPersistence(entity: EmployeeEntity): Prisma.EmployeeUncheckedCreateInput {
    const props = entity.toPersistence();
    return {
      id: props.id,
      businessId: props.businessId,
      name: props.name,
      phone: props.phone,
    };
  }
}
