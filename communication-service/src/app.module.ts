import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthLibModule, JwtAuthGuard, RolesGuard } from "@bookingai/auth";
import { AppConfigModule } from "./config/config.module";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { MessagingModule } from "./modules/messaging/messaging.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule, AuthLibModule, MessagingModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}