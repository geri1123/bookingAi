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

interface WhatsappWebhookPayload {
  object?: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      field: string;
      value?: {
        metadata?: { phone_number_id?: string };
        messages?: Array<{ id: string; from: string; type: string; text?: { body: string } }>;
      };
    }>;
  }>;
}

@Public()
@Controller("webhooks/whatsapp")
export class WhatsappWebhookController {
  private readonly logger = new Logger(WhatsappWebhookController.name);

  constructor(
    private readonly appConfig: AppConfigService,
    private readonly signatureVerifier: MetaWebhookSignatureVerifier,
    private readonly handleInboundMessage: HandleInboundChannelMessageUseCase,
    private readonly idempotencyService: WebhookIdempotencyService,
  ) {}

  // Meta e thote nje here, kur e vendos webhook URL-in ne App Dashboard
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

  // Meta e thote per çdo mesazh/event te ri
  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(
    @Req() req: RawBodyRequest<Request>,
    @Headers("x-hub-signature-256") signature: string | undefined,
    @Body() payload: WhatsappWebhookPayload,
  ): Promise<{ success: true }> {
    this.signatureVerifier.verify(signature, req.rawBody);

   
    this.process(payload).catch((err) =>
      this.logger.error(`Gabim gjate procesimit te webhook-ut WhatsApp: ${err instanceof Error ? err.message : err}`),
    );

    return { success: true };
  }

  private async process(payload: WhatsappWebhookPayload): Promise<void> {
    if (payload.object !== "whatsapp_business_account") return;

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== "messages") continue;

        const phoneNumberId = change.value?.metadata?.phone_number_id;
        if (!phoneNumberId) continue;

        for (const message of change.value?.messages ?? []) {
          if (message.type !== "text" || !message.text?.body) continue;

        
          const isNew = await this.idempotencyService.markProcessedIfNew(message.id);
          if (!isNew) continue;

          await this.handleInboundMessage.execute({
            channel: ChannelType.WHATSAPP,
            receivingAccountId: phoneNumberId,
            senderExternalId: message.from,
            text: message.text.body,
          });
        }
      }
    }
  }
}