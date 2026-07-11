import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AppConfigModule } from '../../config/config.module';
import { AppConfigService } from '../../config/config.service';

@Global()
@Module({
  imports: [
    AppConfigModule,
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        connection: {
          url: config.redisUrl,      
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        },
      }),
    }),
  ],
  exports: [BullModule],
})
export class BullmqModule {}