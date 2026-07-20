import { Prisma } from "@prisma/client";
import { UserEntity } from "../entities/user.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";


export abstract class UserCreateRepository {
    abstract create(user: UserEntity, tx?: TransactionContext): Promise<UserEntity>;

}