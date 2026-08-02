import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessChannelConnectionWriteRepository } from "../../../domain/repositories/business-channel-connection-write.repository";
import { BusinessChannelConnectionEntity } from "../../../domain/entities/business-channel-connection.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { BusinessChannelConnectionMapper } from "../mappers/business-channel-connection.mapper";

@Injectable()
export class PrismaBusinessChannelConnectionWriteRepository implements BusinessChannelConnectionWriteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    connection: BusinessChannelConnectionEntity,
    tx?: TransactionContext,
  ): Promise<BusinessChannelConnectionEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.businessChannelConnection.create({
      data: BusinessChannelConnectionMapper.toPersistence(connection),
    });
    return BusinessChannelConnectionMapper.toDomain(created);
  }

  async update(
    connection: BusinessChannelConnectionEntity,
    tx?: TransactionContext,
  ): Promise<BusinessChannelConnectionEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const updated = await client.businessChannelConnection.update({
      where: { id: connection.id },
      data: BusinessChannelConnectionMapper.toPersistence(connection),
    });
    return BusinessChannelConnectionMapper.toDomain(updated);
  }
}
