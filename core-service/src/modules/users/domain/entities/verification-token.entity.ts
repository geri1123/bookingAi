import { randomUUID } from "crypto";

export enum TokenType {
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_CHANGE = "EMAIL_CHANGE",
}

export interface VerificationTokenProps {
  id: string;
  userId: string;
  token: string;
  type: TokenType;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
}

export class VerificationTokenEntity {
  private constructor(private props: VerificationTokenProps) {}

  static create(userId: string, token: string, type: TokenType): VerificationTokenEntity {
    const now = new Date();
    return new VerificationTokenEntity({
      id: randomUUID(),
      userId,
      token,
      type,
      expiresAt: new Date(now.getTime() + VerificationTokenEntity.ttlMsFor(type)),
      usedAt: null,
      createdAt: now,
    });
  }

  private static ttlMsFor(type: TokenType): number {
    switch (type) {
      case TokenType.PASSWORD_RESET:
        return 30 * 60 * 1000; 
      case TokenType.EMAIL_VERIFICATION:
      case TokenType.EMAIL_CHANGE:
      default:
        return 10 * 60 * 1000; 
          }
  }

  static reconstitute(props: VerificationTokenProps): VerificationTokenEntity {
    return new VerificationTokenEntity(props);
  }

  get id() { return this.props.id; }
  get userId() { return this.props.userId; }
  get token() { return this.props.token; }
  get type() { return this.props.type; }
  get expiresAt() { return this.props.expiresAt; }
  get usedAt() { return this.props.usedAt; }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt;
  }

  isUsed(): boolean {
    return this.props.usedAt !== null;
  }

  markAsUsed(): void {
    this.props.usedAt = new Date();
  }

  toPersistence(): VerificationTokenProps {
    return { ...this.props };
  }
}