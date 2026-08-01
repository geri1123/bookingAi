import { Global, Module } from "@nestjs/common";
import Redis from "ioredis";
import { AppConfigService } from "../../config/config.service";
import { DistributedLockService } from "./distributed-lock.service";
import { REDIS_CLIENT } from "./redis.constants";

export { REDIS_CLIENT };
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => new Redis(config.redisUrl, { maxRetriesPerRequest: 3 }),
    },
    DistributedLockService,
  ],
  exports: [REDIS_CLIENT, DistributedLockService],
})
export class RedisModule {}