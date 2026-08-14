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

interface MetaMessagingEvent {
  sender: { id: string };
  recipient: { id: string };
  message?: { mid?: string; text?: string; is_echo?: boolean };
}

interface MetaMessagingWebhookPayload {
  object?: "page" | "instagram";
  entry?: Array<{
    id: string;
    messaging?: MetaMessagingEvent[];
  }>;
}

@Public()
@Controller("webhooks/meta")
export class MetaMessagingWebhookController {
  private readonly logger = new Logger(MetaMessagingWebhookController.name);

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
    @Body() payload: MetaMessagingWebhookPayload,
  ): Promise<{ success: true }> {
    this.signatureVerifier.verify(signature, req.rawBody);
    this.process(payload).catch((err) =>
      this.logger.error(`Gabim gjate procesimit te webhook-ut Meta: ${err instanceof Error ? err.message : err}`),
    );
    return { success: true };
  }

  private async process(payload: MetaMessagingWebhookPayload): Promise<void> {
    if (payload.object !== "page" && payload.object !== "instagram") return;
    const channel = payload.object === "instagram" ? ChannelType.INSTAGRAM : ChannelType.MESSENGER;

    for (const entry of payload.entry ?? []) {
      for (const event of entry.messaging ?? []) {
        if (!event.message?.text || event.message.is_echo) continue;
        await this.processMessage(channel, event);
      }
    }
  }

  private async processMessage(channel: ChannelType, event: MetaMessagingEvent): Promise<void> {
    const messageId = event.message?.mid;

    if (!messageId) {
      this.logger.warn("Mesazh Meta pa 'mid' — pa mbrojtje idempotency, procesohet direkt.");
      await this.runInbound(channel, event, undefined);
      return;
    }

    const acquired = await this.idempotencyService.tryAcquireProcessing(messageId);
    if (!acquired) return;

    try {
      await this.idempotencyService.runWithHeartbeat(messageId, () =>
        this.runInbound(channel, event, messageId),
      );
      await this.idempotencyService.markProcessed(messageId);
    } catch (err) {
      this.logger.error(
        `Perpunimi i mesazhit ${messageId} deshtoi: ${err instanceof Error ? err.message : err}`,
      );

      const limitReached = await this.idempotencyService.recordFailureAndCheckLimit(messageId);
      if (limitReached) {
        this.logger.error(`Mesazhi ${messageId} arriti limitin e deshtimeve — nuk riprovohet me.`);
        await this.idempotencyService.markProcessed(messageId);
      } else {
        await this.idempotencyService.releaseOnFailure(messageId);
      }
    }
  }

  private async runInbound(
    channel: ChannelType,
    event: MetaMessagingEvent,
    messageId: string | undefined,
  ): Promise<void> {
    await this.handleInboundMessage.execute({
      channel,
      receivingAccountId: event.recipient.id,
      senderExternalId: event.sender.id,
      text: event.message!.text!,
      providerId: messageId,
    });
  }
}