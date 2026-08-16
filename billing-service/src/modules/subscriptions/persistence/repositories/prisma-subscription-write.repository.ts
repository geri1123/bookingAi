import { Injectable } from "@nestjs/common";

import { Prisma } from "../../../../generated/prisma-client";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { SubscriptionWriteRepository } from "../../domain/repositories/subscription-write.repository";
import { SubscriptionEntity } from "../../domain/entities/subscription.entity";
import { TransactionContext } from "../../../../common/domain/transaction-context";
import { SubscriptionMapper } from "../mappers/subscription.mapper";

@Injectable()
export class PrismaSubscriptionWriteRepository implements SubscriptionWriteRepository {
  constructor(private readonly prisma: PrismaService) {}


  async create(subscription: SubscriptionEntity, tx?: TransactionContext): Promise<SubscriptionEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.subscription.create({
      data: SubscriptionMapper.toPersistence(subscription),
    });
    return SubscriptionMapper.toDomain(created);
  }

  async update(subscription: SubscriptionEntity, tx?: TransactionContext): Promise<SubscriptionEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const updated = await client.subscription.update({
      where: { id: subscription.id },
      data: SubscriptionMapper.toPersistence(subscription),
    });
    return SubscriptionMapper.toDomain(updated);
  }
    async markExpiredNotifiedIfFirstTime(businessId: string): Promise<boolean> {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      UPDATE subscriptions
      SET expired_notified_at = now()
      WHERE business_id = ${businessId} AND expired_notified_at IS NULL
      RETURNING id
    `;
    return rows.length > 0;
  }
}
