import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { AppConfigModule } from './config/config.module';
import { OutboxModule } from './modules/outbox/outbox.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),   
    AppConfigModule,
    PrismaModule,
    KafkaModule,
    OutboxModule,             
    UsersModule,
  ],
})
export class AppModule {}