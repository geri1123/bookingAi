import { Prisma } from "@prisma/client";
import { VerificationTokenEntity } from "../entities/verification-token.entity";

export abstract class VerificationTokenRepository {
  abstract create(token: VerificationTokenEntity, tx?: Prisma.TransactionClient): Promise<VerificationTokenEntity>;
  abstract findByToken(token: string, tx?: Prisma.TransactionClient): Promise<VerificationTokenEntity | null>;
  abstract markAsUsed(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}