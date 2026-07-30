import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';


@Injectable()
export class PrismaService 
  extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy {

  constructor() {

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
      // Madhesia e pool-it te lidhjeve pg. Rrite sipas ngarkeses (HTTP + outbox relay).
      max: Number(process.env.DATABASE_POOL_MAX ?? 20),
      // Sa kohe (ms) pret nje kerkese per nje lidhje te lire para se te deshtoje.
      connectionTimeoutMillis: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 10_000),
      // Mbyll lidhjet e papërdorura pas kesaj kohe, per te mos i mbajtur te hapura kot.
      idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT_MS ?? 30_000),
    });

    super({
      adapter,
    });
  }


  async onModuleInit() {
    await this.$connect();
    console.log(`Prisma connected (pool max=${process.env.DATABASE_POOL_MAX ?? 20})`);
  }


  async onModuleDestroy() {
    await this.$disconnect();
  }
}