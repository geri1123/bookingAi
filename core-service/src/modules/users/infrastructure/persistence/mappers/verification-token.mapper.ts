// infrastructure/persistence/mappers/verification-token.mapper.ts
import { VerificationToken as PrismaVerificationToken, TokenType as PrismaTokenType } from "@prisma/client";
import { VerificationTokenEntity, TokenType } from "../../../domain/entities/verification-token.entity";

function toDomainTokenType(type: PrismaTokenType): TokenType {
  return TokenType[type];
}

function toPrismaTokenType(type: TokenType): PrismaTokenType {
  return type as PrismaTokenType;
}

export class VerificationTokenMapper {
  static toDomain(raw: PrismaVerificationToken): VerificationTokenEntity {
    return VerificationTokenEntity.reconstitute({
      id: raw.id,
      userId: raw.userId,
      token: raw.token,
      type: toDomainTokenType(raw.type),
      expiresAt: raw.expiresAt,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(entity: VerificationTokenEntity) {
    const props = entity.toPersistence();
    return {
      ...props,
      type: toPrismaTokenType(props.type),
    };
  }
}