import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { EmployeeCreateRepository } from "../../../domain/repositories/employee-create.repository";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { EmployeeMapper } from "../mappers/employee.mapper";

@Injectable()
export class PrismaEmployeeCreateRepository implements EmployeeCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(employee: EmployeeEntity, tx?: TransactionContext): Promise<EmployeeEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.employee.create({ data: EmployeeMapper.toPersistence(employee) });
    return EmployeeMapper.toDomain(created);
  }
}
