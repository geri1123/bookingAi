import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService as PrismaClient } from "../../../../../infrastructure/prisma/prisma.service";
import { ServiceCreateRepository } from "../../../domain/repositories/service-create.repository";
import { ServiceEntity } from "../../../domain/entities/service.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ServiceMapper } from "../mappers/service.mapper";

@Injectable()
export class PrismaServiceCreateRepository implements ServiceCreateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(service: ServiceEntity, tx?: TransactionContext): Promise<ServiceEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.service.create({ data: ServiceMapper.toPersistence(service) });
    return ServiceMapper.toDomain(created);
  }
}