// src/modules/invitations/domain/entities/invitation.entity.ts
import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessMemberRole } from "../../../business/domain/entities/business-member.entity";
import { InvitationErrorCode } from "../errors/invitation-error-codes.enum";

export enum InviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  EXPIRED = "EXPIRED",
  REVOKED = "REVOKED",
}

const DEFAULT_EXPIRY_DAYS = 7;

export interface InvitationProps {
  id: string;
  businessId: string;
  email: string;
  role: BusinessMemberRole;
  token: string;
  status: InviteStatus;
  invitedBy: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface NewInvitationProps {
  businessId: string;
  email: string;
  role: BusinessMemberRole;
  invitedBy: string;
  token: string;
}

export class InvitationEntity {
  private constructor(private props: InvitationProps) {}

  static create(props: NewInvitationProps): InvitationEntity {
    if (props.role === BusinessMemberRole.OWNER) {
      throw new AppException(
        InvitationErrorCode.CANNOT_INVITE_AS_OWNER,
        { field: "role" },
        HttpStatus.FORBIDDEN,
      );
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + DEFAULT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    return new InvitationEntity({
      id: randomUUID(),
      businessId: props.businessId,
      email: props.email.toLowerCase().trim(),
      role: props.role,
      token: props.token,
      status: InviteStatus.PENDING,
      invitedBy: props.invitedBy,
      expiresAt,
      createdAt: now,
    });
  }

  static reconstitute(props: InvitationProps): InvitationEntity {
    return new InvitationEntity(props);
  }

  isExpired(): boolean {
    return this.props.expiresAt < new Date();
  }

  isPending(): boolean {
    return this.props.status === InviteStatus.PENDING;
  }

  markAccepted(): void {
    this.props.status = InviteStatus.ACCEPTED;
  }

  markRevoked(): void {
    this.props.status = InviteStatus.REVOKED;
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get email() { return this.props.email; }
  get role() { return this.props.role; }
  get token() { return this.props.token; }
  get status() { return this.props.status; }
  get invitedBy() { return this.props.invitedBy; }
  get expiresAt() { return this.props.expiresAt; }
  get createdAt() { return this.props.createdAt; }

  toPersistence(): InvitationProps {
    return { ...this.props };
  }
}