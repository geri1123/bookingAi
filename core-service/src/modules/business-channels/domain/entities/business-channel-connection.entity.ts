import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessChannelErrorCode } from "../errors/business-channel-error-codes.enum";

export enum ChannelType {
  WHATSAPP = "WHATSAPP",
  MESSENGER = "MESSENGER",
  INSTAGRAM = "INSTAGRAM",
}

export enum ChannelConnectionStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

export interface BusinessChannelConnectionProps {
  id: string;
  businessId: string;
  channel: ChannelType;
  externalAccountId: string;
  accessTokenEncrypted: string;
  status: ChannelConnectionStatus;
  aiEnabled: boolean;
  connectedAt: Date;
  updatedAt: Date;
  disconnectedAt: Date | null;
}

export interface NewBusinessChannelConnectionProps {
  businessId: string;
  channel: ChannelType;
  externalAccountId: string;
  accessTokenEncrypted: string;
}

export class BusinessChannelConnectionEntity {
  private constructor(private props: BusinessChannelConnectionProps) {}

  static create(props: NewBusinessChannelConnectionProps): BusinessChannelConnectionEntity {
    if (!props.externalAccountId?.trim()) {
      throw new AppException(
        BusinessChannelErrorCode.INVALID_EXTERNAL_ACCOUNT_ID,
        { field: "externalAccountId" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = new Date();
    return new BusinessChannelConnectionEntity({
      id: randomUUID(),
      businessId: props.businessId,
      channel: props.channel,
      externalAccountId: props.externalAccountId.trim(),
      accessTokenEncrypted: props.accessTokenEncrypted,
      status: ChannelConnectionStatus.CONNECTED,
      aiEnabled: true,
      connectedAt: now,
      updatedAt: now,
      disconnectedAt: null,
    });
  }

  static reconstitute(props: BusinessChannelConnectionProps): BusinessChannelConnectionEntity {
    return new BusinessChannelConnectionEntity(props);
  }

  // Perdoret kur biznesi rilidh nje kanal qe e pati shkeputur me pare, ose refreshon token-in
  reconnect(externalAccountId: string, accessTokenEncrypted: string): void {
    this.props.externalAccountId = externalAccountId.trim();
    this.props.accessTokenEncrypted = accessTokenEncrypted;
    this.props.status = ChannelConnectionStatus.CONNECTED;
    this.props.disconnectedAt = null;
    this.props.updatedAt = new Date();
  }

  disconnect(): void {
    this.props.status = ChannelConnectionStatus.DISCONNECTED;
    this.props.disconnectedAt = new Date();
    this.props.updatedAt = new Date();
  }

  setAiEnabled(enabled: boolean): void {
    this.props.aiEnabled = enabled;
    this.props.updatedAt = new Date();
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get channel() { return this.props.channel; }
  get externalAccountId() { return this.props.externalAccountId; }
  get accessTokenEncrypted() { return this.props.accessTokenEncrypted; }
  get status() { return this.props.status; }
  get aiEnabled() { return this.props.aiEnabled; }
  get connectedAt() { return this.props.connectedAt; }
  get updatedAt() { return this.props.updatedAt; }
  get disconnectedAt() { return this.props.disconnectedAt; }

  get isActive(): boolean {
    return this.props.status === ChannelConnectionStatus.CONNECTED;
  }

  toPersistence(): BusinessChannelConnectionProps {
    return { ...this.props };
  }
}
