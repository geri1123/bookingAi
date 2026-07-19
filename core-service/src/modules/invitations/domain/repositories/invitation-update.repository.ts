import { Prisma } from "@prisma/client";
import { InvitationEntity } from "../entities/invitation.entity";

export abstract class InvitationUpdateRepository {
  abstract update(invitation: InvitationEntity, tx?: Prisma.TransactionClient): Promise<void>;
    abstract expireOverdue(): Promise<number>;
}