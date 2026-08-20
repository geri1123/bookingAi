import { Controller, Post, Req, HttpCode, HttpStatus } from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import type { Request } from "express";
import { PaddleWebhookSignatureVerifier } from "../../infrastructure/http/paddle-webhook-signature-verifier";
import { HandlePaddleWebhookUseCase, PaddleWebhookEventPayload } from "../../application/use-cases/handle-paddle-webhook.use-case";

@Controller("webhooks/paddle")
export class PaddleWebhookController {
  constructor(
    private readonly signatureVerifier: PaddleWebhookSignatureVerifier,
    private readonly handleWebhook: HandlePaddleWebhookUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async receive(@Req() req: RawBodyRequest<Request>) {
    this.signatureVerifier.verify(req.rawBody!, req.headers["paddle-signature"] as string | undefined);

    const payload = JSON.parse(req.rawBody!.toString("utf8")) as PaddleWebhookEventPayload;
    await this.handleWebhook.execute(payload);

   
    return { received: true };
  }
}
