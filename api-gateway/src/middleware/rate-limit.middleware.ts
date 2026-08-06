import { NextFunction, Request, Response } from "express";
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
      res.status(429).json({
        success: false,
        code: "RATE_LIMIT_EXCEEDED",
        message: "Shumë kërkesa. Provo përsëri pas pak.",
      });
      return;
    }

    next();
  };
}
