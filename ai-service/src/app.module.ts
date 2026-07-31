import { Module } from "@nestjs/common";

import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { ConversationModule } from "./modules/conversation/conversation.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AppConfigModule } from "./config/config.module";   

@Module({
  imports: [AppConfigModule, PrismaModule, ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}