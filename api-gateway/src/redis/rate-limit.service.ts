import { Inject, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";


const INCR_WITH_TTL_SCRIPT = `
local current = redis.call("INCR", KEYS[1])
if current == 1 then
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
end
return current
`;

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  retryAfterSeconds: number;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}


  async checkAndIncrement(key: string, windowMs: number, maxRequests: number): Promise<RateLimitResult> {
    const redisKey = `ratelimit:${key}`;

    try {
      const count = (await this.redis.eval(INCR_WITH_TTL_SCRIPT, 1, redisKey, windowMs)) as number;
      const ttlMs = await this.redis.pttl(redisKey);

      return {
        allowed: count <= maxRequests,
        count,
        limit: maxRequests,
        retryAfterSeconds: Math.max(1, Math.ceil((ttlMs > 0 ? ttlMs : windowMs) / 1000)),
      };
    } catch (err) {
      this.logger.warn(
        `Redis s'u përgjigj për rate limit ('${key}') — kërkesa lejohet (fail-open): ${
          err instanceof Error ? err.message : err
        }`,
      );
      return { allowed: true, count: 0, limit: maxRequests, retryAfterSeconds: 0 };
    }
  }
}
