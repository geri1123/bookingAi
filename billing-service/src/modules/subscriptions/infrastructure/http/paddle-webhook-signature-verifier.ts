import { Injectable, HttpStatus } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import { AppConfigService } from "../../../../config/config.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { SubscriptionErrorCode } from "../../domain/errors/subscription-error-codes.enum";

@Injectable()
export class PaddleWebhookSignatureVerifier {
  constructor(private readonly appConfig: AppConfigService) {}

  verify(rawBody: Buffer, signatureHeader: string | undefined): void {
    if (!signatureHeader) {
      throw new AppException(
        SubscriptionErrorCode.WEBHOOK_SIGNATURE_MISSING,
        { field: "paddle-signature" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const parts = Object.fromEntries(
      signatureHeader.split(";").map((p) => p.split("=") as [string, string]),
    );
    const timestamp = parts.ts;
    const receivedHmac = parts.h1;
    if (!timestamp || !receivedHmac) {
      throw new AppException(
        SubscriptionErrorCode.WEBHOOK_SIGNATURE_MALFORMED,
        { field: "paddle-signature" },
        HttpStatus.BAD_REQUEST,
      );
    }

    const signedPayload = `${timestamp}:${rawBody.toString("utf8")}`;
    const expectedHmac = createHmac("sha256", this.appConfig.paddleWebhookSecret)
      .update(signedPayload)
      .digest("hex");

    const expected = Buffer.from(expectedHmac, "utf8");
    const received = Buffer.from(receivedHmac, "utf8");
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      throw new AppException(
        SubscriptionErrorCode.WEBHOOK_SIGNATURE_MISMATCH,
        { field: "paddle-signature" },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}