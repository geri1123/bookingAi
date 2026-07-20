import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService as PrismaClient } from "../../../../../infrastructure/prisma/prisma.service";
import { ServiceUpdateRepository } from "../../../domain/repositories/service-update.repository";
import { ServiceEntity } from "../../../domain/entities/service.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ServiceMapper } from "../mappers/service.mapper";

@Injectable()
export class PrismaServiceUpdateRepository implements ServiceUpdateRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async update(service: ServiceEntity, tx?: TransactionContext): Promise<ServiceEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const data = ServiceMapper.toPersistence(service);
    const updated = await client.service.update({ where: { id: service.id }, data });
    return ServiceMapper.toDomain(updated);
  }
}