export interface UsageCounterProps {
  id: string;
  businessId: string;
  periodStart: Date;
  periodEnd: Date;
  messageCount: number;
}


export class UsageCounterEntity {
  private constructor(private readonly props: UsageCounterProps) {}

  static reconstitute(props: UsageCounterProps): UsageCounterEntity {
    return new UsageCounterEntity(props);
  }

  get id() {
    return this.props.id;
  }
  get businessId() {
    return this.props.businessId;
  }
  get periodStart() {
    return this.props.periodStart;
  }
  get periodEnd() {
    return this.props.periodEnd;
  }
  get messageCount() {
    return this.props.messageCount;
  }

  hasReachedLimit(limit: number | null): boolean {
    if (limit === null) return false;
    return this.props.messageCount >= limit;
  }

  toPersistence(): UsageCounterProps {
    return { ...this.props };
  }
}
