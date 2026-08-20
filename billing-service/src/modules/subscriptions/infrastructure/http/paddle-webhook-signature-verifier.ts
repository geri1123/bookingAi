import { Injectable, BadRequestException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import { AppConfigService } from "../../../../config/config.service";

@Injectable()
export class PaddleWebhookSignatureVerifier {
  constructor(private readonly appConfig: AppConfigService) {}

  verify(rawBody: Buffer, signatureHeader: string | undefined): void {
    if (!signatureHeader) {
      throw new BadRequestException("Mungon Paddle-Signature header.");
    }

    const parts = Object.fromEntries(
      signatureHeader.split(";").map((p) => p.split("=") as [string, string]),
    );
    const timestamp = parts.ts;
    const receivedHmac = parts.h1;
    if (!timestamp || !receivedHmac) {
      throw new BadRequestException("Paddle-Signature header i pavlefshem.");
    }

    console.log("DEBUG secret:", JSON.stringify(this.appConfig.paddleWebhookSecret));
    console.log("DEBUG rawBody:", JSON.stringify(rawBody.toString("utf8")));
    console.log("DEBUG received hmac:", receivedHmac);

    const signedPayload = `${timestamp}:${rawBody.toString("utf8")}`;
    const expectedHmac = createHmac("sha256", this.appConfig.paddleWebhookSecret)
      .update(signedPayload)
      .digest("hex");

    console.log("DEBUG expected hmac:", expectedHmac);

    const expected = Buffer.from(expectedHmac, "utf8");
    const received = Buffer.from(receivedHmac, "utf8");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      throw new BadRequestException("Nenshkrimi i Paddle-Signature s'perputhet.");
    }
  }
}