import {
  BadRequestException, Body, Controller, Get, Headers, HttpCode, HttpStatus,
  Logger, Post, Query, RawBodyRequest, Req,
} from "@nestjs/common";
import { Request } from "express";
import { Public } from "@bookingai/auth";
import { WebhookIdempotencyService } from "../../../../infrastructure/redis/webhook-idempotency.service";
import { AppConfigService } from "../../../../config/config.service";
import { MetaWebhookSignatureVerifier } from "../../infrastructure/security/meta-webhook-signature.verifier";
import { HandleInboundMessageUseCase } from "../../application/handle-inbound-message.use-case";
import { ChannelType } from "../../domain/entities/channel-type.enum";

interface WhatsappMessage {
  id: string;
  from: string;
  type: string;
  text?: { body: string };
}

interface WhatsappWebhookPayload {
  object?: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      field: string;
      value?: {
        metadata?: { phone_number_id?: string };
        messages?: WhatsappMessage[];
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
    private readonly handleInboundMessage: HandleInboundMessageUseCase,
    private readonly idempotencyService: WebhookIdempotencyService,
  ) {}

  @Get()
  verify(
    @Query("hub.mode") mode: string,
    @Query("hub.verify_token") verifyToken: string,
    @Query("hub.challenge") challenge: string,
  ): string {
    if (mode === "subscribe" && verifyToken === this.appConfig.metaWebhookVerifyToken) return challenge;
    throw new BadRequestException("Verifikim i pavlefshem.");
  }

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
          await this.processMessage(phoneNumberId, message);
        }
      }
    }
  }

  private async processMessage(phoneNumberId: string, message: WhatsappMessage): Promise<void> {
    const acquired = await this.idempotencyService.tryAcquireProcessing(message.id);
    if (!acquired) return;

    try {
      await this.idempotencyService.runWithHeartbeat(message.id, () =>
        this.runInbound(phoneNumberId, message),
      );
      await this.idempotencyService.markProcessed(message.id);
    } catch (err) {
      this.logger.error(
        `Perpunimi i mesazhit ${message.id} deshtoi: ${err instanceof Error ? err.message : err}`,
      );

      const limitReached = await this.idempotencyService.recordFailureAndCheckLimit(message.id);
      if (limitReached) {
        this.logger.error(`Mesazhi ${message.id} arriti limitin e deshtimeve — nuk riprovohet me.`);
        await this.idempotencyService.markProcessed(message.id);
      } else {
        await this.idempotencyService.releaseOnFailure(message.id);
      }
    }
  }

  private async runInbound(phoneNumberId: string, message: WhatsappMessage): Promise<void> {
    await this.handleInboundMessage.execute({
      channel: ChannelType.WHATSAPP,
      receivingAccountId: phoneNumberId,
      senderExternalId: message.from,
      text: message.text!.body,
      providerId: message.id,
    });
  }
}