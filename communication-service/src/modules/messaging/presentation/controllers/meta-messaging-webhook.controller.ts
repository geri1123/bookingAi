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

interface MetaMessagingWebhookPayload {
  object?: "page" | "instagram";
  entry?: Array<{
    id: string;
    messaging?: Array<{
      sender: { id: string };
      recipient: { id: string };
      message?: { mid?: string; text?: string; is_echo?: boolean };
    }>;
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

        const messageId = event.message.mid;

        if (messageId) {
          const acquired = await this.idempotencyService.tryAcquireProcessing(messageId);
          if (!acquired) continue;
        }

        try {
          await this.handleInboundMessage.execute({
            channel,
            receivingAccountId: event.recipient.id,
            senderExternalId: event.sender.id,
            text: event.message.text,
            providerId: messageId,
          });

          if (messageId) await this.idempotencyService.markProcessed(messageId);
        } catch (err) {
          if (messageId) await this.idempotencyService.releaseOnFailure(messageId);
          this.logger.error(
            `Perpunimi i mesazhit ${messageId ?? "(pa mid)"} deshtoi: ${err instanceof Error ? err.message : err}`,
          );
        }
      }
    }
  }
}