import { Controller, Get, Post, Patch, Body, UseGuards, ParseEnumPipe, ParseBoolPipe } from "@nestjs/common";
import { JwtAuthGuard, BusinessContextGuard, CurrentUser, RolesGuard, Roles } from "@bookingai/auth";
import { JwtPayload } from "@bookingai/auth";
import { SubscriptionGuardService } from "../../application/services/subscription-guard.service";
import { PrismaSubscriptionWriteRepository } from "../../persistence/repositories/prisma-subscription-write.repository";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { CreateUpgradeCheckoutUseCase } from "../../application/use-cases/create-upgrade-checkout.use-case";
import { PlanTier } from "../../domain/entities/plan.entity";
import { CancelSubscriptionUseCase } from "../../application/use-cases/cancel-subscription.use-case";
import { ResumeSubscriptionUseCase } from "../../application/use-cases/resume-subscription.use-case";


@Controller("subscriptions")
@UseGuards(JwtAuthGuard, BusinessContextGuard, RolesGuard)
export class SubscriptionController {
  constructor(
    private readonly subscriptionGuard: SubscriptionGuardService,
    private readonly createUpgradeCheckoutUseCase: CreateUpgradeCheckoutUseCase,
    private readonly cancelSubscriptionUseCase: CancelSubscriptionUseCase,
    private readonly resumeSubscriptionUseCase: ResumeSubscriptionUseCase,
  ) {}

  @Get("me")
  async getMySubscription(@CurrentUser() user: JwtPayload) {
    const result = await this.subscriptionGuard.checkAiAccess(user.businessId as string);
    return { success: true, ...result };
  }


  @Post("upgrade-checkout")
  @Roles('OWNER')
  async createUpgradeCheckout(
    @CurrentUser() user: JwtPayload,
    @Body("targetTier", new ParseEnumPipe(PlanTier)) targetTier: PlanTier,
  ) {
    const result = await this.createUpgradeCheckoutUseCase.execute(user.businessId as string, targetTier);
    return { success: true, ...result };
  }
  @Patch("auto-renew")
  @Roles('OWNER')
  async setAutoRenew(
    @CurrentUser() user: JwtPayload,
    @Body("autoRenew", ParseBoolPipe) autoRenew: boolean,
  ) {
    if (autoRenew) {
      await this.resumeSubscriptionUseCase.execute(user.businessId as string);
      return { success: true, autoRenew: true };
    }
    await this.cancelSubscriptionUseCase.execute(user.businessId as string);
    return { success: true, autoRenew: false };
  }
}