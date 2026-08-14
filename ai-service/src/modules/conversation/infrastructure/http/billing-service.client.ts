import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";

export interface ConsumeMessageResult {
  allowed: boolean;
  reason: string;
  messageCount: number;
  messageLimit: number | null;
}

export class BillingServiceError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`billing-service error ${status}: ${JSON.stringify(body)}`);
  }
}

@Injectable()
export class BillingServiceClient {
  private readonly logger = new Logger(BillingServiceClient.name);

  constructor(private readonly appConfig: AppConfigService) {}

  // Thirret 1 here per mesazh hyres, PARA se t'i drejtohemi LLM-se, qe te mos
  // paguajme per thirrje AI kur biznesi e ka arritur limitin mujor te planit.
  async consumeMessage(businessId: string): Promise<ConsumeMessageResult> {
    const url = `${this.appConfig.billingServiceUrl}/internal/${businessId}/usage/consume-message`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "x-internal-api-key": this.appConfig.internalApiKey },
    });

    const json = await response.json().catch(() => null);
    if (!response.ok) {
      throw new BillingServiceError(response.status, json);
    }
    return json as ConsumeMessageResult;
  }

  async consumeMessageSafe(businessId: string): Promise<ConsumeMessageResult> {
    try {
      return await this.consumeMessage(businessId);
    } catch (err) {
      this.logger.error(
        `Gabim gjate kontrollit te limitit te mesazheve per biznesin ${businessId}: ${
          err instanceof Error ? err.message : err
        }. Lejohet mesazhi (fail-open).`,
      );
      return { allowed: true, reason: "BILLING_SERVICE_UNAVAILABLE", messageCount: -1, messageLimit: null };
    }
  }
}