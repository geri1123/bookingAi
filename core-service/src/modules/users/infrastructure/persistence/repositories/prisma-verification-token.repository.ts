// infrastructure/persistence/repositories/prisma-verification-token.repository.ts
import { Injectable, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { VerificationTokenRepository } from "../../../domain/repositories/verification-token.repository";
import { VerificationTokenEntity } from "../../../domain/entities/verification-token.entity";
import { VerificationTokenMapper } from "../mappers/verification-token.mapper";
import { AppException } from "../../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../domain/errors/user-error-codes.enum";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaVerificationTokenRepository implements VerificationTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    token: VerificationTokenEntity,
    tx?: Prisma.TransactionClient,
  ): Promise<VerificationTokenEntity> {
    const client = tx ?? this.prisma;
    const data = VerificationTokenMapper.toPersistence(token);
    const created = await client.verificationToken.create({ data });
    return VerificationTokenMapper.toDomain(created);
  }

  async findByToken(token: string): Promise<VerificationTokenEntity | null> {
    const raw = await this.prisma.verificationToken.findUnique({ where: { token } });
    return raw ? VerificationTokenMapper.toDomain(raw) : null;
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.verificationToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}