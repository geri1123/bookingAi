import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { timingSafeEqual } from "crypto";
import { AppConfigService } from "../../config/config.service";

@Injectable()
export class InternalApiKeyGuard implements CanActivate {
  constructor(private readonly appConfig: AppConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const provided = req.headers["x-internal-api-key"];

    if (typeof provided !== "string") {
      throw new UnauthorizedException("Mungon x-internal-api-key.");
    }

    const expected = this.appConfig.internalApiKey;
    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(expected);

    if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
      throw new UnauthorizedException("x-internal-api-key i pavlefshem.");
    }

    return true;
  }
}