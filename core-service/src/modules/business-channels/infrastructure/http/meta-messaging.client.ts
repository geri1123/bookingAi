import { Injectable, Logger } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";

export interface SendMessageParams {
  channel: ChannelType;
  // phone_number_id (WhatsApp) / page_id (Messenger) / ig_business_account_id (Instagram) i biznesit
  senderAccountId: string;
  // numri i klientit (WhatsApp) ose PSID/IGSID (Messenger/Instagram)
  recipientExternalId: string;
  text: string;
  accessToken: string; // i dekriptuar, vetem per kete thirrje
}

@Injectable()
export class MetaMessagingClient {
  private readonly logger = new Logger(MetaMessagingClient.name);

  constructor(private readonly appConfig: AppConfigService) {}

  async sendMessage(params: SendMessageParams): Promise<void> {
    if (params.channel === ChannelType.WHATSAPP) {
      await this.sendWhatsapp(params);
    } else {
      await this.sendMessengerOrInstagram(params);
    }
  }

  private async sendWhatsapp(params: SendMessageParams): Promise<void> {
    const url = `${this.appConfig.metaGraphApiBaseUrl}/${params.senderAccountId}/messages`;
    await this.post(url, params.accessToken, {
      messaging_product: "whatsapp",
      to: params.recipientExternalId,
      type: "text",
      text: { body: params.text },
    });
  }

  // Messenger dhe Instagram Direct perdorin te njejtin format Send API
  private async sendMessengerOrInstagram(params: SendMessageParams): Promise<void> {
    const url = `${this.appConfig.metaGraphApiBaseUrl}/${params.senderAccountId}/messages`;
    await this.post(url, params.accessToken, {
      recipient: { id: params.recipientExternalId },
      message: { text: params.text },
      messaging_type: "RESPONSE",
    });
  }

  private async post(url: string, accessToken: string, body: unknown): Promise<void> {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errBody = await response.text().catch(() => "");
      this.logger.error(`Meta Graph API dergimi deshtoi (${response.status}): ${errBody}`);
      throw new Error(`Meta send failed: ${response.status}`);
    }
  }
}
