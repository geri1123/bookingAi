import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

const MAX_FAILURES = 3;
const FAILURE_COUNT_TTL_SECONDS = 3600;

@Injectable()
export class WebhookIdempotencyService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private key(messageId: string): string {
    return `webhook:msg:${messageId}`;
  }

  private failuresKey(messageId: string): string {
    return `webhook:msg:${messageId}:failures`;
  }

  async tryAcquireProcessing(messageId: string, lockTtlSeconds = 30): Promise<boolean> {
    const result = await this.redis.set(this.key(messageId), "processing", "EX", lockTtlSeconds, "NX");
    return result === "OK";
  }

  // "Heartbeat" — ripërtërin TTL-në e lock-ut ndërsa procesimi vazhdon (p.sh. AI po pergjigjet).
  // Perdoret nga nje interval qe therritet periodikisht gjate procesimit, jo vetem nje here.
  async refreshProcessing(messageId: string, lockTtlSeconds = 30): Promise<void> {
    await this.redis.expire(this.key(messageId), lockTtlSeconds);
  }

  async markProcessed(messageId: string, ttlSeconds = 3600): Promise<void> {
    await this.redis.set(this.key(messageId), "processed", "EX", ttlSeconds);
    await this.redis.del(this.failuresKey(messageId));
  }

  async releaseOnFailure(messageId: string): Promise<void> {
    await this.redis.del(this.key(messageId));
  }

  // Rrit numeruesin e deshtimeve per kete mesazh. Kthen true nese eshte arritur limiti max
  // (d.m.th. mesazhi duhet trajtuar si "dead" — mos e riprovo me, log/alert).
  async recordFailureAndCheckLimit(messageId: string): Promise<boolean> {
    const count = await this.redis.incr(this.failuresKey(messageId));
    if (count === 1) {
      await this.redis.expire(this.failuresKey(messageId), FAILURE_COUNT_TTL_SECONDS);
    }
    return count >= MAX_FAILURES;
  }

  // Mbeshtjell nje procesim te gjate me heartbeat automatik, qe lock-u i idempotency
  // te mos skadoje ndersa procesimi ende vazhdon (p.sh. thirrje LLM > TTL fillestar).
  // Perdorim: await this.idempotencyService.runWithHeartbeat(messageId, () => this.doWork());
  async runWithHeartbeat<T>(
    messageId: string,
    work: () => Promise<T>,
    heartbeatIntervalSeconds = 15,
  ): Promise<T> {
    const interval = setInterval(() => {
      this.refreshProcessing(messageId).catch(() => {});
    }, heartbeatIntervalSeconds * 1000);

    try {
      return await work();
    } finally {
      clearInterval(interval);
    }
  }
}