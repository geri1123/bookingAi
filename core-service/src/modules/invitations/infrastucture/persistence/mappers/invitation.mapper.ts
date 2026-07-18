// src/modules/invitations/infrastructure/persistence/mappers/invitation.mapper.ts
import { Invite as PrismaInvite } from "@prisma/client";
import { InvitationEntity } from "../../../domain/entities/invitation.entity";

export class InvitationMapper {
  static toDomain(raw: PrismaInvite): InvitationEntity {
    return InvitationEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      email: raw.email,
      role: raw.role as any,
      token: raw.token,
      status: raw.status as any,
      invitedBy: raw.invitedBy,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(entity: InvitationEntity) {
    return { ...entity.toPersistence() };
  }
}