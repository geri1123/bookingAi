import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT } from "./redis.constants";

@Injectable()
export class WebhookIdempotencyService {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  // Kthen true nese eshte HERA E PARE qe shohim kete messageId (dhe e "kycim" per 1 ore).
  // Kthen false nese e kemi trajtuar tashme (retry i Meta-s) - duhet injoruar.
  async markProcessedIfNew(messageId: string, ttlSeconds = 3600): Promise<boolean> {
    const key = `webhook:msg:${messageId}`;
    const result = await this.redis.set(key, "1", "EX", ttlSeconds, "NX");
    return result === "OK";
  }
}