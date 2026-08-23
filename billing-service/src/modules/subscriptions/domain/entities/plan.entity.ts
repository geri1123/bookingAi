export enum PlanTier {
  FREE = "FREE",
  STARTER = "STARTER",
  PRO = "PRO",
  PRO_PLUS = "PRO_PLUS",
}
export interface PlanProps {
  id: string;
  tier: PlanTier;
  name: string;
  priceCents: number;
  messageLimit: number | null; // null = pakufi
  durationDays: number;
  paddlePriceId: string | null;
  createdAt: Date;
}


export class PlanEntity {
  private constructor(private readonly props: PlanProps) {}

  static reconstitute(props: PlanProps): PlanEntity {
    return new PlanEntity(props);
  }

  get id() {
    return this.props.id;
  }
  get tier() {
    return this.props.tier;
  }
  get name() {
    return this.props.name;
  }
  get priceCents() {
    return this.props.priceCents;
  }
  get messageLimit() {
    return this.props.messageLimit;
  }
  get durationDays() {
    return this.props.durationDays;
  }
  get paddlePriceId() {
    return this.props.paddlePriceId;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  get isUnlimited(): boolean {
    return this.props.messageLimit === null;
  }

  toPersistence(): PlanProps {
    return { ...this.props };
  }
}