import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { UserDeleteRepository } from "../../../domain/repositories/user-delete.repository";

@Injectable()
export class PrismaUserDeleteRepository implements UserDeleteRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string): Promise<void> {
    // soft-delete rekomandohet, jo hard delete, sepse ke deletedAt në skemë
    await this.prisma.user.update({
      where: { id },
      data: { status: "DELETED", deletedAt: new Date() },
    });
  }
}