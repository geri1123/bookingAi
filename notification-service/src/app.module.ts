import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppConfigModule } from './config/config.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { BullmqModule } from './infrastructure/queue/bullmq.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    AppConfigModule,
    KafkaModule,
    BullmqModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
