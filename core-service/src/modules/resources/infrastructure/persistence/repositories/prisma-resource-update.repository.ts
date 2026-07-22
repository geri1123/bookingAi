import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ResourceUpdateRepository } from "../../../domain/repositories/resource-update.repository";
import { ResourceEntity } from "../../../domain/entities/resource.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ResourceMapper } from "../mappers/resource.mapper";

@Injectable()
export class PrismaResourceUpdateRepository implements ResourceUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(resource: ResourceEntity, tx?: TransactionContext): Promise<ResourceEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const props = resource.toPersistence();
    const updated = await client.resource.update({
      where: { id: props.id },
      data: { name: props.name, type: props.type, capacity: props.capacity },
    });
    return ResourceMapper.toDomain(updated);
  }
}
