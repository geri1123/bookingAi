import { Prisma } from "@prisma/client";
import { UserEntity } from "../entities/user.entity";


export abstract class UserCreateRepository {
  abstract create(user: UserEntity, tx?: Prisma.TransactionClient): Promise<UserEntity>;
}