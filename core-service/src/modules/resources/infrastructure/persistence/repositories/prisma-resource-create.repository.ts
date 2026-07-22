import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ResourceCreateRepository } from "../../../domain/repositories/resource-create.repository";
import { ResourceEntity } from "../../../domain/entities/resource.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ResourceMapper } from "../mappers/resource.mapper";

@Injectable()
export class PrismaResourceCreateRepository implements ResourceCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(resource: ResourceEntity, tx?: TransactionContext): Promise<ResourceEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.resource.create({ data: ResourceMapper.toPersistence(resource) });
    return ResourceMapper.toDomain(created);
  }
}
