import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { CustomerCreateRepository } from "../../../domain/repositories/customer-create.repository";
import { CustomerEntity } from "../../../domain/entities/customer.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { CustomerMapper } from "../mappers/customer.mapper";

@Injectable()
export class PrismaCustomerCreateRepository implements CustomerCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(customer: CustomerEntity, tx?: TransactionContext): Promise<CustomerEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.customer.create({ data: CustomerMapper.toPersistence(customer) });
    return CustomerMapper.toDomain(created);
  }
}
