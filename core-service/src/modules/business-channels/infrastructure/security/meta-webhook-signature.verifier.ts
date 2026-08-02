import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import { AppConfigService } from "../../../../config/config.service";

@Injectable()
export class MetaWebhookSignatureVerifier {
  constructor(private readonly appConfig: AppConfigService) {}

  // header: "sha256=<hex>" ; rawBody: trupi i papreket i request-it (Buffer)
  verify(signatureHeader: string | undefined, rawBody: Buffer | undefined): void {
    if (!signatureHeader || !rawBody) {
      throw new UnauthorizedException("Mungon X-Hub-Signature-256.");
    }

    const expected = createHmac("sha256", this.appConfig.metaAppSecret).update(rawBody).digest("hex");
    const provided = signatureHeader.replace("sha256=", "");

    const expectedBuf = Buffer.from(expected, "hex");
    const providedBuf = Buffer.from(provided, "hex");

    if (
      expectedBuf.length !== providedBuf.length ||
      !timingSafeEqual(expectedBuf, providedBuf)
    ) {
      throw new UnauthorizedException("Nenshkrim i pavlefshem per webhook-un.");
    }
  }
}
