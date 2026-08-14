import { Controller, HttpCode, HttpStatus, Param, Post, Get, UseGuards } from "@nestjs/common";
import { SubscriptionGuardService } from "../../application/services/subscription-guard.service";
import { ConsumeMessageUsageService } from "../../application/services/consume-message-usage.service";
import { InternalApiKeyGuard } from "../../../../common/guards/internal-api-key.guard";

@Controller("internal/:businessId")
@UseGuards(InternalApiKeyGuard)
export class InternalSubscriptionController {
  constructor(
    private readonly subscriptionGuard: SubscriptionGuardService,
    private readonly consumeMessageUsage: ConsumeMessageUsageService,
  ) {}


  @Get("ai-access")
  @HttpCode(HttpStatus.OK)
  async checkAiAccess(@Param("businessId") businessId: string) {
    const result = await this.subscriptionGuard.checkAiAccess(businessId);
    return { success: true, ...result };
  }


  @Post("usage/consume-message")
  @HttpCode(HttpStatus.OK)
  async consumeMessage(@Param("businessId") businessId: string) {
    const result = await this.consumeMessageUsage.consume(businessId);
    return { success: true, ...result };
  }
}
