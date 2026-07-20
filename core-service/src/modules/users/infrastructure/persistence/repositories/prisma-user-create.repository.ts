// infrastructure/persistence/repositories/prisma-user-create.repository.ts
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";

import { UserCreateRepository } from "../../../domain/repositories/user-create.repository";
import { UserEntity } from "../../../domain/entities/user.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { UserMapper } from "../mappers/user.mapper";
import { EmailAlreadyExistsError } from "../../../domain/errors/email-already-exists.error";
import { UsernameAlreadyTakenError } from "../../../domain/errors/username-already-taken.error";

@Injectable()
export class PrismaUserCreateRepository implements UserCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserEntity, tx?: TransactionContext): Promise<UserEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    try {
      const data = UserMapper.toPersistence(user);
      const created = await client.user.create({ data });
      return UserMapper.toDomain(created);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined) ?? [];

        if (target.includes("email")) {
          throw new EmailAlreadyExistsError(user.email);
        }
        if (target.includes("username")) {
          throw new UsernameAlreadyTakenError(user.username);
        }
      }

      throw err;
    }
  }
}