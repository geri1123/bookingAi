import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AuthLibModule, JwtAuthGuard, RolesGuard } from '@bookingai/auth';   
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { AppConfigModule } from './config/config.module';
import { OutboxModule } from './modules/outbox/outbox.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitationsModule } from './modules/invitations/invitation.module';
import { ServicesModule } from './modules/services/services.module';
import { EmployeesModule } from './modules/employees/employee.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { BusinessActivationModule } from './modules/business-activation/business-activation.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { BusinessModule } from './modules/business/bussines.module';
import { BusinessChannelsModule } from './modules/business-channels/business-channels.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { RateLimitModule } from './infrastructure/rate-limit/rate-limit.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AppConfigModule,
    PrismaModule,
    KafkaModule,
    CloudinaryModule,
    OutboxModule,
    UsersModule,
    AuthLibModule,
    AuthModule,
    InvitationsModule,
    ServicesModule,
    EmployeesModule,
    SchedulesModule,
    BusinessActivationModule,
    ReservationsModule,
    CustomersModule,
    BusinessModule,
    BusinessChannelsModule,
    RedisModule,
    RateLimitModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}