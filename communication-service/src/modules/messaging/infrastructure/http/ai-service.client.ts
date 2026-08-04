import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { ChannelType } from "../../domain/entities/channel-type.enum";

export interface HandleIncomingMessageParams {
  businessId: string;
  customerExternalId: string;
  channel: ChannelType;
  text: string;
}

@Injectable()
export class AiServiceClient {
  private readonly logger = new Logger(AiServiceClient.name);

  constructor(private readonly appConfig: AppConfigService) {}

  async handleIncomingMessage(params: HandleIncomingMessageParams): Promise<string> {
    const url = `${this.appConfig.aiServiceUrl}/internal/conversations/handle-message`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": this.appConfig.internalApiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      this.logger.error(`ai-service u pergjigj me ${response.status}: ${body}`);
      throw new Error(`ai-service error ${response.status}`);
    }

    const json = (await response.json()) as { replyText: string };
    return json.replyText ?? "";
  }
}