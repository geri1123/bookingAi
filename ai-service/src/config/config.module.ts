import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';   // <-- kjo mungonte
import { AppConfigService } from './config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}