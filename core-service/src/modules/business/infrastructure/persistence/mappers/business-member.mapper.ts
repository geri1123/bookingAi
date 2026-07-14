import { BusinessMember as PrismaBusinessMember } from "@prisma/client";
import { BusinessMemberEntity } from "../../../domain/entities/business-member.entity";

export class BusinessMemberMapper {
  static toDomain(raw: PrismaBusinessMember): BusinessMemberEntity {
    return BusinessMemberEntity.reconstitute({
      id: raw.id,
      userId: raw.userId,
      businessId: raw.businessId,
      role: raw.role as any,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(entity: BusinessMemberEntity) {
    return { ...entity.toPersistence() };
  }
}