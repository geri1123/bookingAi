import { Inject, Injectable, Logger } from "@nestjs/common";
import Redis from "ioredis";
import { Business as PrismaBusiness } from "@prisma/client";
import { REDIS_CLIENT } from "../../../../../infrastructure/redis/redis.constants";

const TTL_SECONDS = 300;

function cacheKey(businessId: string): string {
  return `business:${businessId}`;
}
@Injectable()
export class BusinessCacheService {
  private readonly logger = new Logger(BusinessCacheService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async get(businessId: string): Promise<PrismaBusiness | null> {
  try {
    const cached = await this.redis.get(cacheKey(businessId));
    if (!cached) {
      this.logger.debug(`MISS -> ${cacheKey(businessId)}`);
      return null;
    }

    this.logger.debug(`HIT  -> ${cacheKey(businessId)}`);
    const parsed = JSON.parse(cached);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    } as PrismaBusiness;
  } catch (err) {
    this.logger.warn(`GET dështoi per business ${businessId}: ${(err as Error).message}`);
    return null;
  }
}

  async set(business: PrismaBusiness): Promise<void> {
    try {
      await this.redis.set(cacheKey(business.id), JSON.stringify(business), "EX", TTL_SECONDS);
    } catch (err) {
      this.logger.warn(`SET dështoi per business ${business.id}: ${(err as Error).message}`);
    }
  }

  async invalidate(businessId: string): Promise<void> {
    try {
      await this.redis.del(cacheKey(businessId));
    } catch (err) {
      this.logger.warn(`DEL dështoi per business ${businessId}: ${(err as Error).message}`);
    }
  }
}