import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";

export interface BusinessContact {
  businessId: string;
  businessName: string;
  ownerEmail: string | null;
  ownerFirstName: string | null;
}

@Injectable()
export class CoreServiceClient {
  constructor(private readonly appConfig: AppConfigService) {}

  async getBusinessContact(businessId: string): Promise<BusinessContact | null> {
    const url = `${this.appConfig.coreServiceUrl}/internal/businesses/${businessId}/contact`;
    const response = await fetch(url, { headers: { "x-internal-api-key": this.appConfig.internalApiKey } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`core-service contact lookup failed: ${response.status}`);
    return (await response.json()) as BusinessContact;
  }
}