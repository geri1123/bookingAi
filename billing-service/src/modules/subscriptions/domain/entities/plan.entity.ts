export enum PlanTier {
  FREE = "FREE",
  STARTER = "STARTER",
  PRO = "PRO",
}

export interface PlanProps {
  id: string;
  tier: PlanTier;
  name: string;
  priceCents: number;
  messageLimit: number | null; // null = pakufi
  durationDays: number;
  createdAt: Date;
}

// Plan eshte te dhena reference (seeduar ne DB, jo krijuar nga useri), keshtu
// qe entiteti eshte thjesht immutable — s'ka nevoje per metoda mutuese.
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
