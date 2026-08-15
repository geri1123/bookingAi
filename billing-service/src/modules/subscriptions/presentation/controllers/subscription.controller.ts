import { Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard, BusinessContextGuard, CurrentUser, RolesGuard, Roles } from "@bookingai/auth";
import { JwtPayload } from "@bookingai/auth";
import { SubscriptionGuardService } from "../../application/services/subscription-guard.service";
import { PrismaSubscriptionWriteRepository } from "../../persistence/repositories/prisma-subscription-write.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { CreateSubscriptionUseCase } from "../../application/use-cases/create-subscription.use-case";


@Controller("subscriptions")
@UseGuards(JwtAuthGuard, BusinessContextGuard, RolesGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionGuard: SubscriptionGuardService,
    private readonly createSubscriptionUseCase: CreateSubscriptionUseCase,
  ) {}

  @Get("me")
  async getMySubscription(@CurrentUser() user: JwtPayload) {
    const result = await this.subscriptionGuard.checkAiAccess(user.businessId as string);
    return { success: true, ...result };
  }
   @Post("subscribe")
   @Roles('OWNER')
  async createSubscription(@CurrentUser() user: JwtPayload) {
    const subscription =
      await this.createSubscriptionUseCase.execute(
        user.businessId as string,
      );

    return {
      success: true,
      subscription,
    };
  }
}
