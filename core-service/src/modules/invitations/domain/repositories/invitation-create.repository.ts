import { Prisma } from "@prisma/client";
import { InvitationEntity } from "../entities/invitation.entity";

export abstract class InvitationCreateRepository {
  abstract create(invitation: InvitationEntity, tx?: Prisma.TransactionClient): Promise<void>;
}