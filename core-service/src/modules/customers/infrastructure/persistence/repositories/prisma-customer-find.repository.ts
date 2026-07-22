import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { CustomerFindRepository } from "../../../domain/repositories/customer-find.repository";
import { CustomerEntity } from "../../../domain/entities/customer.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { CustomerMapper } from "../mappers/customer.mapper";

@Injectable()
export class PrismaCustomerFindRepository implements CustomerFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CustomerEntity | null> {
    const raw = await this.prisma.customer.findUnique({ where: { id } });
    return raw ? CustomerMapper.toDomain(raw) : null;
  }

  async findByPhone(businessId: string, phone: string, tx?: TransactionContext): Promise<CustomerEntity | null> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const raw = await client.customer.findUnique({
      where: { businessId_phone: { businessId, phone } },
    });
    return raw ? CustomerMapper.toDomain(raw) : null;
  }

  async findAllByBusiness(businessId: string): Promise<CustomerEntity[]> {
    const rows = await this.prisma.customer.findMany({
      where: { businessId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(CustomerMapper.toDomain);
  }
}
