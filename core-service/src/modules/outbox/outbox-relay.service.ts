import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { KafkaProducerService } from "../../infrastructure/kafka/kafka-producer.service";

const MAX_RETRIES = 5;
const BATCH_SIZE = 50;

interface OutboxEventRow {
  id: string;
  event_type: string;
  aggregate_id: string;
  payload: unknown;
  retry_count: number;
}

@Injectable()
export class OutboxRelayService {
  private readonly logger = new Logger(OutboxRelayService.name);
  private isRunning = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

@Cron(CronExpression.EVERY_SECOND)
async relayPendingEvents() {
  if (this.isRunning) return;
  this.isRunning = true;

  try {
    
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
        data: { status: 'PROCESSING' }, 
      });

      return rows;
    });

    // Hapi 2: tani jashtë transaksionit
    for (const event of events) {
      try {
        await this.kafkaProducer.send(event.event_type, event.aggregate_id, event.payload);

        await this.prisma.kafkaEvent.update({
          where: { id: event.id },
          data: { status: 'PUBLISHED', publishedAt: new Date() },
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const newRetryCount = event.retry_count + 1;

        await this.prisma.kafkaEvent.update({
          where: { id: event.id },
          data: {
            retryCount: newRetryCount,
            status: newRetryCount >= MAX_RETRIES ? 'FAILED' : 'PENDING',
          },
        });

        this.logger.error(`Failed to publish event ${event.id}: ${message}`);
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    this.logger.error(`Outbox relay failed: ${message}`);
  } finally {
    this.isRunning = false;
  }
}
  @Cron(CronExpression.EVERY_HOUR)
  async cleanupOldEvents() {
    const publishedCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const failedCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [publishedResult, failedResult] = await Promise.all([
      this.prisma.kafkaEvent.deleteMany({
        where: { status: 'PUBLISHED', publishedAt: { lt: publishedCutoff } },
      }),
      this.prisma.kafkaEvent.deleteMany({
        where: { status: 'FAILED', createdAt: { lt: failedCutoff } },
      }),
    ]);

    if (publishedResult.count > 0 || failedResult.count > 0) {
      this.logger.log(
        `Cleanup: ${publishedResult.count} published, ${failedResult.count} failed events removed`,
      );
    }
  }
}