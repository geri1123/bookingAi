import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { KafkaProducerService, TopicBatch } from "../../infrastructure/kafka/kafka-producer.service";

const MAX_RETRIES = 5;
const BATCH_SIZE = 2000; // ~40x me e madhe se me pare — reduktoi drastikisht round-trips
const IDLE_SLEEP_MS = 200; // sa pret kur s'ka pune, para se te riprovoje

interface OutboxEventRow {
  id: string;
  event_type: string;
  aggregate_id: string;
  payload: unknown;
  retry_count: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class OutboxRelayService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxRelayService.name);
  private stopped = false;
  private loopPromise: Promise<void> | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

 
  onModuleInit() {
    this.loopPromise = this.runLoop();
  }

  async onModuleDestroy() {
    this.stopped = true;
    if (this.loopPromise) await this.loopPromise;
  }

  private async runLoop(): Promise<void> {
    while (!this.stopped) {
      let processedCount = 0;
      try {
        processedCount = await this.relayOneBatch();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Outbox relay batch failed: ${message}`);
      }

    
      if (processedCount < BATCH_SIZE) {
        await sleep(IDLE_SLEEP_MS);
      }
    }
  }

  private async relayOneBatch(): Promise<number> {
    const events = await this.prisma.$transaction(async (tx) => {
      const rows = await tx.$queryRaw<OutboxEventRow[]>`
        SELECT id, event_type, aggregate_id, payload, retry_count
        FROM kafka_events
        WHERE status = 'PENDING' AND retry_count < ${MAX_RETRIES}
        ORDER BY created_at ASC
        LIMIT ${BATCH_SIZE}
        FOR UPDATE SKIP LOCKED
      `;

      if (rows.length === 0) return [];

      const ids = rows.map((r) => r.id);
      await tx.kafkaEvent.updateMany({
        where: { id: { in: ids } },
        data: { status: "PROCESSING" },
      });

      return rows;
    });

    if (events.length === 0) return 0;

  
    const byTopic = new Map<string, OutboxEventRow[]>();
    for (const event of events) {
      const arr = byTopic.get(event.event_type) ?? [];
      arr.push(event);
      byTopic.set(event.event_type, arr);
    }

    const topicBatches: TopicBatch[] = Array.from(byTopic.entries()).map(([topic, rows]) => ({
      topic,
      messages: rows.map((r) => ({ key: r.aggregate_id, value: JSON.stringify(r.payload) })),
    }));

    try {
      // RRUGA E SHPEJTE: 1 thirrje Kafka + 1 update DB per TE GJITHE batch-in
      await this.kafkaProducer.sendBatch(topicBatches);

      await this.prisma.kafkaEvent.updateMany({
        where: { id: { in: events.map((e) => e.id) } },
        data: { status: "PUBLISHED", publishedAt: new Date() },
      });
    } catch (err) {
      
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`sendBatch failed (${message}), falling back to per-event send for this batch.`);

      for (const event of events) {
        try {
          await this.kafkaProducer.send(event.event_type, event.aggregate_id, event.payload);
          await this.prisma.kafkaEvent.update({
            where: { id: event.id },
            data: { status: "PUBLISHED", publishedAt: new Date() },
          });
        } catch (innerErr) {
          const innerMessage = innerErr instanceof Error ? innerErr.message : String(innerErr);
          const newRetryCount = event.retry_count + 1;

          await this.prisma.kafkaEvent.update({
            where: { id: event.id },
            data: {
              retryCount: newRetryCount,
              status: newRetryCount >= MAX_RETRIES ? "FAILED" : "PENDING",
            },
          });

          this.logger.error(`Failed to publish event ${event.id}: ${innerMessage}`);
        }
      }
    }

    return events.length;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOldEvents() {
    const publishedCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const failedCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [publishedResult, failedResult] = await Promise.all([
      this.prisma.kafkaEvent.deleteMany({
        where: { status: "PUBLISHED", publishedAt: { lt: publishedCutoff } },
      }),
      this.prisma.kafkaEvent.deleteMany({
        where: { status: "FAILED", createdAt: { lt: failedCutoff } },
      }),
    ]);

    if (publishedResult.count > 0 || failedResult.count > 0) {
      this.logger.log(`Cleanup: ${publishedResult.count} published, ${failedResult.count} failed events removed`);
    }
  }
}