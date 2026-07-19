import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AuthLibModule, JwtAuthGuard, RolesGuard } from '@bookingai/auth';   
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { AppConfigModule } from './config/config.module';
import { OutboxModule } from './modules/outbox/outbox.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitationsModule } from './modules/invitations/invitation.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppConfigModule,
    PrismaModule,
    KafkaModule,
    OutboxModule,
    UsersModule,
    AuthLibModule,
    AuthModule,
    InvitationsModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}