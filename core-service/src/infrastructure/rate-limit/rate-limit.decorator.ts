import { SetMetadata } from "@nestjs/common";

export const RATE_LIMIT_KEY = "rate_limit_options";

export interface RateLimitOptions {
  name: string;
  defaultMaxRequests: number;
  defaultWindowMs: number;
}


export const RateLimit = (name: string, defaultMaxRequests: number, defaultWindowMs: number) =>
  SetMetadata(RATE_LIMIT_KEY, { name, defaultMaxRequests, defaultWindowMs } satisfies RateLimitOptions);