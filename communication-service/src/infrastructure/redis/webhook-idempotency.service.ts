import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

@Injectable()
export class WebhookIdempotencyService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  private key(messageId: string): string {
    return `webhook:msg:${messageId}`;
  }

  
  async tryAcquireProcessing(messageId: string, lockTtlSeconds = 60): Promise<boolean> {
    const result = await this.redis.set(this.key(messageId), "processing", "EX", lockTtlSeconds, "NX");
    return result === "OK";
  }

  async markProcessed(messageId: string, ttlSeconds = 3600): Promise<void> {
    await this.redis.set(this.key(messageId), "processed", "EX", ttlSeconds);
  }

 
  async releaseOnFailure(messageId: string): Promise<void> {
    await this.redis.del(this.key(messageId));
  }
}