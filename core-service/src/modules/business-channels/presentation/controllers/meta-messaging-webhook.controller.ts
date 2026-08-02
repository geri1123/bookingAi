import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  RawBodyRequest,
  Req,
} from "@nestjs/common";
import { Request } from "express";
import { Public } from "@bookingai/auth";
import { WebhookIdempotencyService } from "../../../../infrastructure/redis/webhook-idempotency.service";
import { AppConfigService } from "../../../../config/config.service";
import { MetaWebhookSignatureVerifier } from "../../infrastructure/security/meta-webhook-signature.verifier";
import { HandleInboundChannelMessageUseCase } from "../../application/use-cases/handle-inbound-channel-message.use-case";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";

interface MetaMessagingWebhookPayload {
  object?: "page" | "instagram";
  entry?: Array<{
    id: string; // page_id (Messenger) ose ig_business_account_id (Instagram)
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      message?: { mid?: string; text?: string; is_echo?: boolean };
    }>;
  }>;
}

// Messenger dhe Instagram Direct vijne nga i njejti webhook i Meta-s,
// dallohen vetem nga fusha "object": "page" (Messenger) vs "instagram" (Instagram).
@Public()
@Controller("webhooks/meta")
export class MetaMessagingWebhookController {
  private readonly logger = new Logger(MetaMessagingWebhookController.name);

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly signatureVerifier: MetaWebhookSignatureVerifier,
    private readonly handleInboundMessage: HandleInboundChannelMessageUseCase,
    private readonly idempotencyService: WebhookIdempotencyService,
  ) {}

  @Get()
  verify(
    @Query("hub.mode") mode: string,
    @Query("hub.verify_token") verifyToken: string,
    @Query("hub.challenge") challenge: string,
  ): string {
    if (mode === "subscribe" && verifyToken === this.appConfig.metaWebhookVerifyToken) {
      return challenge;
    }
    throw new BadRequestException("Verifikim i pavlefshem.");
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(
    @Req() req: RawBodyRequest<Request>,
    @Headers("x-hub-signature-256") signature: string | undefined,
    @Body() payload: MetaMessagingWebhookPayload,
  ): Promise<{ success: true }> {
    this.signatureVerifier.verify(signature, req.rawBody);

    this.process(payload).catch((err) =>
      this.logger.error(`Gabim gjate procesimit te webhook-ut Meta: ${err instanceof Error ? err.message : err}`),
    );

    return { success: true };
  }

  private async process(payload: MetaMessagingWebhookPayload): Promise<void> {
    const channel = payload.object === "instagram" ? ChannelType.INSTAGRAM : ChannelType.MESSENGER;
    if (payload.object !== "page" && payload.object !== "instagram") return;

    for (const entry of payload.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        // is_echo = true do te thote mesazhi eshte dërguar nga vete faqja (p.sh. nga dashboard) - injorohet
        if (!event.message?.text || event.message.is_echo) continue;

        if (event.message.mid) {
          const isNew = await this.idempotencyService.markProcessedIfNew(event.message.mid);
          if (!isNew) continue;
        }

        await this.handleInboundMessage.execute({
          channel,
          receivingAccountId: event.recipient.id,
          senderExternalId: event.sender.id,
          text: event.message.text,
        });
      }
    }
  }
}