import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";

export interface CheckAvailabilityParams {
  businessId: string;
  serviceId?: string;
  date: string; // YYYY-MM-DD
  employeeId?: string;
}

export interface CreateReservationParams {
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  serviceId?: string;
  employeeId?: string;
  resourceId?: string;
  partySize?: number;
  startTime: string; // ISO
  endTime?: string; // ISO
}

export interface CheckResourceAvailabilityParams {
  businessId: string;
  startTime: string; // ISO
  endTime: string; // ISO
  partySize?: number;
  resourceType?: string;
}

export interface FindCustomerReservationsParams {
  businessId: string;
  phone: string;
}

export interface CustomerReservationSummary {
  id: string;
  serviceName: string | null;
  startTime: string;
  endTime: string;
  status: string;
}

export interface RescheduleReservationParams {
  businessId: string;
  reservationId: string;
  phone: string;
  startTime: string; // ISO
  endTime?: string; // ISO
}

export interface CancelReservationParams {
  businessId: string;
  reservationId: string;
  phone: string;
}

export interface BusinessInfo {
  id: string;
  name: string;
  type: string;
  language: string;
  timezone: string;
  needsEmployee: boolean;
  needsResource: boolean;
}

export class CoreServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`core-service error ${status}: ${JSON.stringify(body)}`);
  }
}

@Injectable()
export class CoreServiceClient {
  private readonly businessInfoCache = new Map<string, { data: BusinessInfo; expiresAt: number }>();
  private readonly inFlightBusinessInfoRequests = new Map<string, Promise<BusinessInfo>>();

  constructor(private readonly appConfig: AppConfigService) {}

  async checkAvailability(params: CheckAvailabilityParams): Promise<unknown> {
    const query = new URLSearchParams();
    query.set("date", params.date);
    if (params.serviceId) query.set("serviceId", params.serviceId);
    if (params.employeeId) query.set("employeeId", params.employeeId);

    const url = `${this.appConfig.coreServiceUrl}/public/${params.businessId}/availability?${query.toString()}`;
    return this.get(url);
  }

  async checkResourceAvailability(params: CheckResourceAvailabilityParams): Promise<unknown> {
    const query = new URLSearchParams();
    query.set("startTime", params.startTime);
    query.set("endTime", params.endTime);
    if (params.partySize) query.set("partySize", String(params.partySize));
    if (params.resourceType) query.set("resourceType", params.resourceType);

    const url = `${this.appConfig.coreServiceUrl}/public/${params.businessId}/available-resources?${query.toString()}`;
    return this.get(url);
  }

  async getBusinessInfo(businessId: string): Promise<BusinessInfo> {
    const cached = this.businessInfoCache.get(businessId);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const existing = this.inFlightBusinessInfoRequests.get(businessId);
    if (existing) {
      return existing;
    }

    const requestPromise = this.fetchAndCacheBusinessInfo(businessId, cached);
    this.inFlightBusinessInfoRequests.set(businessId, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.inFlightBusinessInfoRequests.delete(businessId);
    }
  }

  private async fetchAndCacheBusinessInfo(
    businessId: string,
    staleCache: { data: BusinessInfo; expiresAt: number } | undefined,
  ): Promise<BusinessInfo> {
    const url = `${this.appConfig.coreServiceUrl}/public/${businessId}/info`;
    try {
      const result = (await this.get(url)) as { business: BusinessInfo };
      this.businessInfoCache.set(businessId, {
        data: result.business,
        expiresAt: Date.now() + this.appConfig.businessInfoCacheTtlMs,
      });
      return result.business;
    } catch (err) {
      if (staleCache) {
        return staleCache.data;
      }
      throw err;
    }
  }

  invalidateBusinessInfoCache(businessId: string): void {
    this.businessInfoCache.delete(businessId);
  }

  async createReservation(params: CreateReservationParams): Promise<any> {
    const { businessId, ...body } = params;
    const url = `${this.appConfig.coreServiceUrl}/public/${businessId}/reservations`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new CoreServiceError(response.status, json);
    }
    return json;
  }

  async findCustomerReservations(
    params: FindCustomerReservationsParams,
  ): Promise<{ success: boolean; reservations: CustomerReservationSummary[] }> {
    const query = new URLSearchParams();
    query.set("phone", params.phone);
    const url = `${this.appConfig.coreServiceUrl}/public/${params.businessId}/reservations/lookup?${query.toString()}`;
    return this.get(url) as Promise<{ success: boolean; reservations: CustomerReservationSummary[] }>;
  }

  async rescheduleReservation(params: RescheduleReservationParams): Promise<any> {
    const { businessId, reservationId, ...body } = params;
    const url = `${this.appConfig.coreServiceUrl}/public/${businessId}/reservations/${reservationId}/reschedule`;

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new CoreServiceError(response.status, json);
    }
    return json;
  }

  async cancelReservation(params: CancelReservationParams): Promise<any> {
    const { businessId, reservationId, ...body } = params;
    const url = `${this.appConfig.coreServiceUrl}/public/${businessId}/reservations/${reservationId}/cancel`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new CoreServiceError(response.status, json);
    }
    return json;
  }

  private async get(url: string): Promise<unknown> {
    const response = await fetch(url);
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new CoreServiceError(response.status, json);
    }
    return json;
  }
}