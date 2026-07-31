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

// Klient per endpoint-et PUBLIKE te core-service (PublicReservationController).
// S'kerkon JWT — ashtu si eshte projektuar per app/widget-in e klientit fundor
// dhe per ai-service.
@Injectable()
export class CoreServiceClient {
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
    const url = `${this.appConfig.coreServiceUrl}/public/${businessId}/info`;
    const result = (await this.get(url)) as { business: BusinessInfo };
    return result.business;
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

  private async get(url: string): Promise<unknown> {
    const response = await fetch(url);
    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new CoreServiceError(response.status, json);
    }
    return json;
  }
}