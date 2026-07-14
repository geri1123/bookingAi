import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessMemberCreateRepository } from "../../../domain/repositories/business-member-create.repository";
import { BusinessMemberEntity } from "../../../domain/entities/business-member.entity";
import { BusinessMemberMapper } from "../mappers/business-member.mapper";

@Injectable()
export class PrismaBusinessMemberCreateRepository implements BusinessMemberCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(member: BusinessMemberEntity, tx?: Prisma.TransactionClient): Promise<BusinessMemberEntity> {
    const client = tx ?? this.prisma;
    const data = BusinessMemberMapper.toPersistence(member);
    const created = await client.businessMember.create({ data });
    return BusinessMemberMapper.toDomain(created);
  }
}