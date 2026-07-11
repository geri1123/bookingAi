import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { UserUpdateRepository, UpdateUserData } from "../../../domain/repositories/user-update.repository";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class PrismaUserUpdateRepository implements UserUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return UserMapper.toDomain(updated);
  }
}