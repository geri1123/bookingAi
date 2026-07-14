import { Prisma } from "@prisma/client";
import { BusinessMemberEntity } from "../entities/business-member.entity";

export abstract class BusinessMemberCreateRepository {
  abstract create(member: BusinessMemberEntity, tx?: Prisma.TransactionClient): Promise<BusinessMemberEntity>;
}