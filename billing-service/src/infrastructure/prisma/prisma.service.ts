import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma-client";
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 10_000),
      idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT_MS ?? 30_000),
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log(`Prisma (billing-service) connected (pool max=${process.env.DATABASE_POOL_MAX ?? 10})`);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
