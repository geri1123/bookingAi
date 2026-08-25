import { Injectable, HttpStatus } from "@nestjs/common";
import { UserFindRepository } from "../../domain/repositories/user-find.repository";
import { UserUpdateRepository, UpdateUserData } from "../../domain/repositories/user-update.repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { AppException } from "../../../../common/exceptions/app.exception";
import { UserErrorCode } from "../../domain/errors/user-error-codes.enum";

export interface UpdateProfileInput {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  preferredLocale?: string;
}

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    private readonly userFindRepo: UserFindRepository,
    private readonly userUpdateRepo: UserUpdateRepository,
  ) {}
async execute(input: UpdateProfileInput): Promise<UserEntity> {
  const user = await this.userFindRepo.findById(input.userId);
  if (!user) {
    throw new AppException(UserErrorCode.USER_NOT_FOUND, { field: "userId" }, HttpStatus.NOT_FOUND);
  }

  const data: UpdateUserData = {};

  if (input.username !== undefined && input.username !== user.username) {
    const existing = await this.userFindRepo.findByUsername(input.username);
    if (existing && existing.id !== user.id) {
      throw new AppException(UserErrorCode.USERNAME_ALREADY_TAKEN, { field: "username" }, HttpStatus.CONFLICT);
    }
    user.changeUsername(input.username);
    data.username = input.username;
  }

  if (input.firstName !== undefined || input.lastName !== undefined) {
    user.changeName(input.firstName ?? user.firstName, input.lastName ?? user.lastName);
    if (input.firstName !== undefined) data.firstName = input.firstName;
    if (input.lastName !== undefined) data.lastName = input.lastName;
  }

  if (input.preferredLocale !== undefined) {
    user.changeLocale(input.preferredLocale);
    data.preferredLocale = input.preferredLocale;
  }

  if (Object.keys(data).length === 0) {
    return user;
  }

  return this.userUpdateRepo.update(user.id, data);
}
}