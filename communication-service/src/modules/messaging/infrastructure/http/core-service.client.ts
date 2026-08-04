import { Injectable } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { ChannelType } from "../../domain/entities/channel-type.enum";

export interface ChannelLookupResult {
  businessId: string;
  isActive: boolean;
  aiEnabled: boolean;
  businessIsActive: boolean;
  accessToken: string | null;
}

@Injectable()
export class CoreServiceClient {
  constructor(private readonly appConfig: AppConfigService) {}

  async lookupChannel(channel: ChannelType, accountId: string): Promise<ChannelLookupResult | null> {
    const url = `${this.appConfig.coreServiceUrl}/internal/business-channels/lookup?channel=${channel}&accountId=${encodeURIComponent(accountId)}`;
    const response = await fetch(url, { headers: { "x-internal-api-key": this.appConfig.internalApiKey } });

    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`core-service lookup deshtoi: ${response.status}`);
    return (await response.json()) as ChannelLookupResult;
  }
}