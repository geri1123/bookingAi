import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessUpdateRepository } from "../../../domain/repositories/business-update.repositoy";
import { BusinessEntity } from "../../../domain/entities/business.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { BusinessMapper } from "../mappers/business.mapper";

@Injectable()
export class PrismaBusinessUpdateRepository implements BusinessUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(business: BusinessEntity, tx?: TransactionContext): Promise<BusinessEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const updated = await client.business.update({ where: { id: business.id }, data: BusinessMapper.toPersistence(business) });
    return BusinessMapper.toDomain(updated);
  }
}