import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ResourceDeleteRepository } from "../../../domain/repositories/resource-delete.repository";
import { TransactionContext } from "../../../../../common/domain/transaction-context";

@Injectable()
export class PrismaResourceDeleteRepository implements ResourceDeleteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string, tx?: TransactionContext): Promise<void> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    await client.resource.delete({ where: { id } });
  }
}
