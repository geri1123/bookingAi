import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_FILTER } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./config/config.module";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { KafkaModule } from "./infrastructure/kafka/kafka.module";
import { OutboxModule } from "./modules/outbox/outbox.module";
import { SubscriptionsModule } from "./modules/subscriptions/subscriptions.module";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppConfigModule,
    PrismaModule,
    KafkaModule,
    OutboxModule,
    SubscriptionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
