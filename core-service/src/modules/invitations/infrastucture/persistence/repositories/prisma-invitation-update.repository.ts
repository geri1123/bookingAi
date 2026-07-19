import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { InvitationUpdateRepository } from "../../../domain/repositories/invitation-update.repository";
import { InvitationEntity, InviteStatus } from "../../../domain/entities/invitation.entity";

@Injectable()
export class PrismaInvitationUpdateRepository implements InvitationUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(invitation: InvitationEntity, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;
    const props = invitation.toPersistence();
    await client.invite.update({
      where: { id: props.id },
      data: { status: props.status },
    });
  }
    async expireOverdue(): Promise<number> {
    const result = await this.prisma.invite.updateMany({
      where: {
        status: InviteStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: InviteStatus.EXPIRED },
    });
    return result.count;
  }
}