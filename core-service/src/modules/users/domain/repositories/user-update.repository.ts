import { Prisma } from "@prisma/client";
import { UserEntity } from "../entities/user.entity";
import { UserStatus } from "../enums/user-status.enum";
import { AuthProvider } from "../enums/auth-provider.enum";

export interface UpdateUserData {
  username?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  status?: UserStatus;
  lastLoginAt?: Date | null;
  emailVerifiedAt?: Date | null;
  preferredLocale?: string;
  googleId?: string;
  authProvider?: AuthProvider;
}

export abstract class UserUpdateRepository {
  abstract update(id: string, data: UpdateUserData, tx?: Prisma.TransactionClient): Promise<UserEntity>;
}