import { User as PrismaUser, UserStatus as PrismaUserStatus } from "@prisma/client";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserStatus } from "../../../domain/enums/user-status.enum";

function toDomainStatus(status: PrismaUserStatus): UserStatus {
  return UserStatus[status];
}

function toPrismaStatus(status: UserStatus): PrismaUserStatus {
  return status as PrismaUserStatus;
}

export class UserMapper {
  static toDomain(raw: PrismaUser): UserEntity {
    return UserEntity.reconstitute({
      id: raw.id,
      username: raw.username,
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      password: raw.password,
      status: toDomainStatus(raw.status),
      preferredLocale: raw.preferredLocale,
      emailVerifiedAt: raw.emailVerifiedAt,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }

  static toPersistence(entity: UserEntity) {
    const props = entity.toPersistence();
    return {
      ...props,
      status: toPrismaStatus(props.status),
    };
  }
}