import { NextFunction, Request, Response } from "express";
import { buildErrorResponse } from "../common/helpers/error-response.helper";
import { GatewayErrorCode } from "../common/errors/error-codes";
import { RateLimitService } from "../redis/rate-limit.service";

export function createRateLimitMiddleware(
  rateLimitService: RateLimitService,
  windowMs: number,
  maxRequests: number,
) {
  return async function rateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
    const key = req.ip ?? "unknown";
    const result = await rateLimitService.checkAndIncrement(key, windowMs, maxRequests);

    res.setHeader("X-RateLimit-Limit", result.limit.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, result.limit - result.count).toString());

    if (!result.allowed) {
      res.setHeader("Retry-After", result.retryAfterSeconds.toString());
      res
        .status(429)
        .json(buildErrorResponse(req, GatewayErrorCode.RATE_LIMIT_EXCEEDED, "Too many requests. Please try again later."));
      return;
    }
    next();
  };
}