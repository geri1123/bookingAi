import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService as PrismaClient } from "../../../../../infrastructure/prisma/prisma.service";
import { ServiceDeleteRepository } from "../../../domain/repositories/service-delete.repository";
import { TransactionContext } from "../../../../../common/domain/transaction-context";

@Injectable()
export class PrismaServiceDeleteRepository implements ServiceDeleteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async delete(id: string, tx?: TransactionContext): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    await client.service.delete({ where: { id } });
  }
}