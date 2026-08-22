import { Module } from "@nestjs/common";
import { AuthLibModule } from "@bookingai/auth";

// Domain repository tokens (abstract) + implementimet Prisma
import { PlanFindRepository } from "./domain/repositories/plan-find.repository";
import { PrismaPlanFindRepository } from "./persistence/repositories/prisma-plan-find.repository";
import { SubscriptionFindRepository } from "./domain/repositories/subscription-find.repository";
import { PrismaSubscriptionFindRepository } from "./persistence/repositories/prisma-subscription-find.repository";
import { SubscriptionWriteRepository } from "./domain/repositories/subscription-write.repository";
import { PrismaSubscriptionWriteRepository } from "./persistence/repositories/prisma-subscription-write.repository";
import { UsageCounterRepository } from "./domain/repositories/usage-counter.repository";
import { PrismaUsageCounterRepository } from "./persistence/repositories/prisma-usage-counter.repository";

// Application services
import { SubscriptionGuardService } from "./application/services/subscription-guard.service";
import { ConsumeMessageUsageService } from "./application/services/consume-message-usage.service";
import { ProvisionFreeSubscriptionService } from "./application/services/provision-free-subscription.service";
import { SubscriptionNotificationService } from "./application/services/subscription-notification.service";
import { SubscriptionExpiryCheckerService } from "./application/services/subscription-expiry-checker.service";

// Infrastructure (Kafka consumer)
import { BusinessEventsConsumer } from "./infrastructure/kafka/business-events.consumer";

// Presentation
import { InternalSubscriptionController } from "./presentation/controllers/internal-subscription.controller";
import { SubscriptionController } from "./presentation/controllers/subscription.controller";
import { PaddleWebhookController } from "./presentation/controllers/paddle-webhook.controller";
import { InternalApiKeyGuard } from "../../common/guards/internal-api-key.guard";
import { HandlePaddleWebhookUseCase } from "./application/use-cases/handle-paddle-webhook.use-case";
import { PaddleWebhookSignatureVerifier } from "./infrastructure/http/paddle-webhook-signature-verifier";
import { CoreServiceClient } from "./infrastructure/http/core-service.client";
import { CreateUpgradeCheckoutUseCase } from "./application/use-cases/create-upgrade-checkout.use-case";
import { CancelSubscriptionUseCase } from "./application/use-cases/cancel-subscription.use-case";
@Module({
  // AuthLibModule duhet importuar KETU (jo vetem ne app.module) sepse
  // SubscriptionController perdor JwtAuthGuard, qe varet nga JwtStrategy.
  imports: [AuthLibModule],
  controllers: [InternalSubscriptionController, SubscriptionController, PaddleWebhookController],
  providers: [
    { provide: PlanFindRepository, useClass: PrismaPlanFindRepository },
    { provide: SubscriptionFindRepository, useClass: PrismaSubscriptionFindRepository },
    { provide: SubscriptionWriteRepository, useClass: PrismaSubscriptionWriteRepository },
    { provide: UsageCounterRepository, useClass: PrismaUsageCounterRepository },
    HandlePaddleWebhookUseCase,
    PaddleWebhookSignatureVerifier,
    SubscriptionGuardService,
    ConsumeMessageUsageService,
    ProvisionFreeSubscriptionService,
    SubscriptionNotificationService,
    SubscriptionExpiryCheckerService,
      CoreServiceClient,
    BusinessEventsConsumer,
    InternalApiKeyGuard,
    CreateUpgradeCheckoutUseCase,
    CancelSubscriptionUseCase
  ],
})
export class SubscriptionsModule {}