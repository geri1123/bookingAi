import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthLibModule, JwtAuthGuard, RolesGuard } from "@bookingai/auth";

import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { ConversationModule } from "./modules/conversation/conversation.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./config/config.module";

@Module({
  imports: [AppConfigModule, PrismaModule, RedisModule, AuthLibModule, ConversationModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}