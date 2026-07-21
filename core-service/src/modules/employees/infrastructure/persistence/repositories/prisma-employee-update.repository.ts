import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { EmployeeUpdateRepository } from "../../../domain/repositories/employee-update.repository";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { EmployeeMapper } from "../mappers/employee.mapper";

@Injectable()
export class PrismaEmployeeUpdateRepository implements EmployeeUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(employee: EmployeeEntity, tx?: TransactionContext): Promise<EmployeeEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const updated = await client.employee.update({
      where: { id: employee.id },
      data: EmployeeMapper.toPersistence(employee),
    });
    return EmployeeMapper.toDomain(updated);
  }
}
