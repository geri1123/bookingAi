import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { UserFindRepository } from "../../../domain/repositories/user-find.repository";
import { UserEntity } from "../../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class PrismaUserFindRepository implements UserFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { username } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { email } });
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { username } });
    return count > 0;
  }
}