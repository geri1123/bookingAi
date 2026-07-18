import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { InvitationCreateRepository } from "../../../domain/repositories/invitation-create.repository";
import { InvitationEntity } from "../../../domain/entities/invitation.entity";
import { InvitationMapper } from "../mappers/invitation.mapper";

@Injectable()
export class PrismaInvitationCreateRepository implements InvitationCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(invitation: InvitationEntity, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    const data = InvitationMapper.toPersistence(invitation);
    await client.invite.create({ data });
  }
}