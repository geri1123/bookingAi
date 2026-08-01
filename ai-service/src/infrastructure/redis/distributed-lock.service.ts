import { Inject, Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

const RELEASE_SCRIPT = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
`;

export class LockAcquisitionTimeoutError extends Error {
  constructor(key: string) {
    super(`S'u mor dot lock-u per '${key}' brenda kohes se lejuar.`);
  }
}

@Injectable()
export class DistributedLockService {
  private readonly logger = new Logger(DistributedLockService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async withLock<T>(
    key: string,
    fn: () => Promise<T>,
    options: { lockTtlMs?: number; maxWaitMs?: number; retryDelayMs?: number } = {},
  ): Promise<T> {
    const lockTtlMs = options.lockTtlMs ?? 30_000;
    const maxWaitMs = options.maxWaitMs ?? 20_000;
    const retryDelayMs = options.retryDelayMs ?? 150;

    const lockKey = `lock:${key}`;
    const token = randomUUID();
    const deadline = Date.now() + maxWaitMs;

    while (true) {
      const acquired = await this.redis.set(lockKey, token, "PX", lockTtlMs, "NX");
      if (acquired === "OK") {
        break;
      }
      if (Date.now() >= deadline) {
        throw new LockAcquisitionTimeoutError(key);
      }
      await this.sleep(retryDelayMs);
    }

    try {
      return await fn();
    } finally {
      try {
        await this.redis.eval(RELEASE_SCRIPT, 1, lockKey, token);
      } catch (err) {
        this.logger.warn(`S'u lirua dot lock-u '${lockKey}': ${err instanceof Error ? err.message : err}`);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}