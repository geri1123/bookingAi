import { UsageCounterEntity } from "../entities/usage-counter.entity";

export interface IncrementUsageParams {
  businessId: string;
  periodStart: Date;
  periodEnd: Date;
  // null = plan pa limit; kur ka limit, incrementIfAllowed eshte atomik: ose e rrit
  // ose refuzon (nese eshte arritur limiti), gjithcka ne 1 goditje SQL, pa lock te jashtem.
  messageLimit: number | null;
}

export interface IncrementUsageResult {
  allowed: boolean;
  messageCount: number;
}

export abstract class UsageCounterRepository {
  abstract findByBusinessAndPeriod(businessId: string, periodStart: Date): Promise<UsageCounterEntity | null>;


  abstract incrementIfAllowed(params: IncrementUsageParams): Promise<IncrementUsageResult>;
}
