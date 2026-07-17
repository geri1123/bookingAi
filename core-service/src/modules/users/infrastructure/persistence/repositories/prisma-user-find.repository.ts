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
  const user = await this.prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user !== null;
}

async existsByUsername(username: string): Promise<boolean> {
  const user = await this.prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return user !== null;
}
  async findByIdentifier(identifier: string): Promise<UserEntity | null> {
  const raw = await this.prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });
  return raw ? UserMapper.toDomain(raw) : null;
}
}