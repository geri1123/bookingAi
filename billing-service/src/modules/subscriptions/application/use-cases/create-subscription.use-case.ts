import { Injectable } from "@nestjs/common";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";

@Injectable()
export class CreateSubscriptionUseCase {
  constructor(
    private readonly subscriptionWriteRepo: SubscriptionWriteRepository,
  ) {}

  async execute(businessId: string) {
  
    const planId = "3bc47c2c-382a-44f7-9721-295b42df2422";

    const subscription = SubscriptionEntity.createFree({
      businessId,
      planId,
      durationDays: 30,
    });

    const created = await this.subscriptionWriteRepo.create(subscription);

    return created;
  }
}