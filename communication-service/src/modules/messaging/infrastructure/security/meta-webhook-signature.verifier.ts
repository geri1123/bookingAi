import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, timingSafeEqual } from "crypto";
import { AppConfigService } from "../../../../config/config.service";

@Injectable()
export class MetaWebhookSignatureVerifier {
  constructor(private readonly appConfig: AppConfigService) {}

  verify(signatureHeader: string | undefined, rawBody: Buffer | undefined): void {
    if (!signatureHeader) {
      throw new UnauthorizedException("Mungon x-hub-signature-256.");
    }
    if (!rawBody) {
      throw new UnauthorizedException("Mungon trupi i papërpunuar (raw body) i kerkeses.");
    }

    const [algo, providedSignature] = signatureHeader.split("=");
    if (algo !== "sha256" || !providedSignature) {
      throw new UnauthorizedException("Format i pavlefshem per x-hub-signature-256.");
    }

    const expectedSignature = createHmac("sha256", this.appConfig.metaAppSecret)
      .update(rawBody)
      .digest("hex");

    const providedBuf = Buffer.from(providedSignature);
    const expectedBuf = Buffer.from(expectedSignature);

    if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
      throw new UnauthorizedException("Nenshkrimi i webhook-ut eshte i pavlefshem.");
    }
  }
}