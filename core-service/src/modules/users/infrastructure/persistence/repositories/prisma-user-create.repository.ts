// infrastructure/persistence/repositories/prisma-user-create.repository.ts
import { Injectable, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";

import { UserCreateRepository } from "../../../domain/repositories/user-create.repository";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";
import { AppException } from "../../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../../domain/errors/user-error-codes.enum";

@Injectable()
export class PrismaUserCreateRepository implements UserCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: UserEntity, tx?:Prisma.TransactionClient): Promise<UserEntity> {
    const client = tx ?? this.prisma; 

    try {
      const data = UserMapper.toPersistence(user);
      const created = await client.user.create({ data });
      return UserMapper.toDomain(created);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002"
      ) {


        const target =
          (err.meta?.target as string[] | undefined)
          ?.join(", ") ?? "field";


        const isEmail = target.includes("email");


        throw new AppException(
          isEmail
            ? UserErrorCode.EMAIL_ALREADY_IN_USE
            : UserErrorCode.USERNAME_ALREADY_TAKEN,

          {
            field: isEmail 
              ? "email" 
              : "username"
          },

          HttpStatus.CONFLICT
        );

      }


      throw err;

    }
  }
}