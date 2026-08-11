import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { RateLimitService } from "./rate-limit.service";
import { RATE_LIMIT_KEY, RateLimitOptions } from "./rate-limit.decorator";
import { AppConfigService } from "../../config/config.service";
import { AppException } from "../../common/exceptions/app.exception";
import { RateLimitErrorCode } from "./rate-limit-error-codes.enum";

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimitService: RateLimitService,
    private readonly appConfig: AppConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<RateLimitOptions | undefined>(RATE_LIMIT_KEY, context.getHandler());
    if (!options) return true; 

    
    const { maxRequests, windowMs } = this.appConfig.getRateLimit(
      options.name,
      options.defaultMaxRequests,
      options.defaultWindowMs,
    );

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

   
    const ip = request.ip ?? "unknown";
    const routeKey = `${options.name}:${ip}`;

    const result = await this.rateLimitService.checkAndIncrement(routeKey, windowMs, maxRequests);

    response.setHeader("X-RateLimit-Limit", result.limit.toString());
    response.setHeader("X-RateLimit-Remaining", Math.max(0, result.limit - result.count).toString());

    if (!result.allowed) {
      response.setHeader("Retry-After", result.retryAfterSeconds.toString());
      throw new AppException(
        RateLimitErrorCode.RATE_LIMIT_EXCEEDED,
        { retryAfterSeconds: result.retryAfterSeconds },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}