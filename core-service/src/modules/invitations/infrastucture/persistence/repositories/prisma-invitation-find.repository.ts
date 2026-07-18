import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { InvitationFindRepository } from "../../../domain/repositories/invitation-find.repository";
import { InvitationEntity, InviteStatus } from "../../../domain/entities/invitation.entity";
import { InvitationMapper } from "../mappers/invitation.mapper";

@Injectable()
export class PrismaInvitationFindRepository implements InvitationFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<InvitationEntity | null> {
    const raw = await this.prisma.invite.findUnique({ where: { token } });
    return raw ? InvitationMapper.toDomain(raw) : null;
  }

  async findPendingByEmailAndBusiness(email: string, businessId: string): Promise<InvitationEntity | null> {
    const raw = await this.prisma.invite.findFirst({
      where: { email: email.toLowerCase().trim(), businessId, status: InviteStatus.PENDING },
    });
    return raw ? InvitationMapper.toDomain(raw) : null;
  }
}