import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";
import { getGatewayConfig } from "../config/gateway.config";
import { RateLimitService } from "./rate-limit.service";
import { REDIS_CLIENT } from "./redis.constants";

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: () => new Redis(getGatewayConfig().redisUrl, { maxRetriesPerRequest: 3 }),
    },
    RateLimitService,
  ],
  exports: [REDIS_CLIENT, RateLimitService],
})
export class RedisModule {}
