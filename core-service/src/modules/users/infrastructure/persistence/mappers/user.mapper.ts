import { User as PrismaUser, UserStatus as PrismaUserStatus, AuthProvider as PrismaAuthProvider } from "@prisma/client";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserStatus } from "../../../domain/enums/user-status.enum";
import { AuthProvider } from "../../../domain/enums/auth-provider.enum";

function toDomainStatus(status: PrismaUserStatus): UserStatus {
  return UserStatus[status];
}

function toPrismaStatus(status: UserStatus): PrismaUserStatus {
  return status as PrismaUserStatus;
}

function toDomainAuthProvider(provider: PrismaAuthProvider): AuthProvider {
  return AuthProvider[provider];
}

function toPrismaAuthProvider(provider: AuthProvider): PrismaAuthProvider {
  return provider as PrismaAuthProvider;
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
      authProvider: toDomainAuthProvider(raw.authProvider),
      googleId: raw.googleId,
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
      authProvider: toPrismaAuthProvider(props.authProvider),
    };
  }

  
  static toResponse(entity: UserEntity) {
    return {
      id: entity.id,
      username: entity.username,
      firstName: entity.firstName,
      lastName: entity.lastName,
      email: entity.email,
      status: entity.status,
      preferredLocale: entity.preferredLocale,
      emailVerifiedAt: entity.emailVerifiedAt,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}