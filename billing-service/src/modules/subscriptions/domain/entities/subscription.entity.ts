import { randomUUID } from "crypto";

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELED = "CANCELED",
  PAST_DUE = "PAST_DUE",
}

export interface SubscriptionProps {
  id: string;
  businessId: string;
  planId: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  paymentProvider: string | null;
  externalReference: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewFreeSubscriptionProps {
  businessId: string;
  planId: string;
  durationDays: number;
}

export class SubscriptionEntity {
  private constructor(private props: SubscriptionProps) {}

  // Krijon abonimin FREE fillestar qe i jepet automatikisht cdo biznesi te ri
  // (shiko ProvisionFreeSubscriptionService, e nxitur nga eventi business.created).
  static createFree(props: NewFreeSubscriptionProps): SubscriptionEntity {
    const now = new Date();
    return new SubscriptionEntity({
      id: randomUUID(),
      businessId: props.businessId,
      planId: props.planId,
      status: SubscriptionStatus.ACTIVE,
      autoRenew: false,
      currentPeriodStart: now,
      currentPeriodEnd: new Date(now.getTime() + props.durationDays * 24 * 60 * 60 * 1000),
      paymentProvider: null,
      externalReference: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(props: SubscriptionProps): SubscriptionEntity {
    return new SubscriptionEntity(props);
  }

  cancel(): void {
   
    this.props.autoRenew = false;
    this.props.updatedAt = new Date();
  }

  markPastDue(): void {
    this.props.status = SubscriptionStatus.PAST_DUE;
    this.props.updatedAt = new Date();
  }

  markExpired(): void {
    this.props.status = SubscriptionStatus.EXPIRED;
    this.props.updatedAt = new Date();
  }

  renew(newPeriodStart: Date, newPeriodEnd: Date): void {
    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.currentPeriodStart = newPeriodStart;
    this.props.currentPeriodEnd = newPeriodEnd;
    this.props.updatedAt = new Date();
  }

 changePlan(planId: string, periodStart: Date, periodEnd: Date): void {
    this.props.planId = planId;
    this.props.status = SubscriptionStatus.ACTIVE;
    this.props.currentPeriodStart = periodStart;
    this.props.currentPeriodEnd = periodEnd;
 
    this.props.autoRenew = true;
    this.props.updatedAt = new Date();
  }
  // Lidh subscription-in tone me identitetin e Paddle-s (customer/subscription
  // ID) - perdoret 1 here, kur pagesa e pare kalon me sukses.
  setPaymentReference(provider: string, externalReference: string): void {
    this.props.paymentProvider = provider;
    this.props.externalReference = externalReference;
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }
  get businessId() {
    return this.props.businessId;
  }
  get planId() {
    return this.props.planId;
  }
  get status() {
    return this.props.status;
  }
  get autoRenew() {
    return this.props.autoRenew;
  }
  get currentPeriodStart() {
    return this.props.currentPeriodStart;
  }
  get currentPeriodEnd() {
    return this.props.currentPeriodEnd;
  }
  get paymentProvider() {
    return this.props.paymentProvider;
  }
  get externalReference() {
    return this.props.externalReference;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  // Rregull biznesi: nje abonim eshte "e vlefshme" per akses AI vetem nese eshte
  // ACTIVE dhe akoma brenda periudhes se paguar. CANCELED/PAST_DUE/EXPIRED bllokojne.
 isCurrentlyValid(now: Date = new Date()): boolean {

    return this.props.status === SubscriptionStatus.ACTIVE && this.props.currentPeriodEnd >= now;
  }

  toPersistence(): SubscriptionProps {
    return { ...this.props };
  }
}
