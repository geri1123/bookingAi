// src/modules/business/domain/entities/business-member.entity.ts
import { randomUUID } from "crypto";

export enum BusinessMemberRole {
  OWNER = "OWNER",
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

export interface BusinessMemberProps {
  id: string;
  userId: string;
  businessId: string;
  role: BusinessMemberRole;
  createdAt: Date;
}

export class BusinessMemberEntity {
  private constructor(private props: BusinessMemberProps) {}

  static create(userId: string, businessId: string, role: BusinessMemberRole): BusinessMemberEntity {
    return new BusinessMemberEntity({
      id: randomUUID(),
      userId,
      businessId,
      role,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: BusinessMemberProps): BusinessMemberEntity {
    return new BusinessMemberEntity(props);
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get businessId() { return this.props.businessId; }
  get role() { return this.props.role; }
  get createdAt() { return this.props.createdAt; }

  toPersistence(): BusinessMemberProps {
    return { ...this.props };
  }
}