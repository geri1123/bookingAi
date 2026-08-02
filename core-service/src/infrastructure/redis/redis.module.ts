import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";
import { AppConfigService } from "../../config/config.service";
import { REDIS_CLIENT } from "./redis.constants";
import { WebhookIdempotencyService } from "./webhook-idempotency.service";

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => new Redis(config.redisUrl, { maxRetriesPerRequest: 3 }),
    },
    WebhookIdempotencyService,
  ],
  exports: [REDIS_CLIENT, WebhookIdempotencyService],
})
export class RedisModule {}