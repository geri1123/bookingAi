import { UserEntity } from "../entities/user.entity";
import { UserStatus } from "../enums/user-status.enum";

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  password?: string;
  status?: UserStatus;
  lastLoginAt?: Date | null;
  emailVerifiedAt?: Date | null;
}

export abstract class UserUpdateRepository {
  abstract update(id: string, data: UpdateUserData): Promise<UserEntity>;
}