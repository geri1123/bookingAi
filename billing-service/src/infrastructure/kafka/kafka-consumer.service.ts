import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { Kafka, Consumer, EachMessagePayload } from "kafkajs";
import { AppConfigService } from "../../config/config.service";

type MessageHandler = (payload: EachMessagePayload) => Promise<void>;

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private kafka: Kafka;
  private consumer: Consumer;
  private connected = false;
  private running = false;

  private readonly handlers = new Map<string, MessageHandler[]>();

  constructor(private appConfig: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.appConfig.serviceName,
      brokers: [this.appConfig.kafkaBroker],
    });
    this.consumer = this.kafka.consumer({ groupId: this.appConfig.serviceName });
  }

  async subscribe(topics: string[], handler: MessageHandler) {
    if (!this.connected) {
      await this.consumer.connect();
      this.connected = true;
    }

    for (const topic of topics) {
      const existing = this.handlers.get(topic) ?? [];
      existing.push(handler);
      this.handlers.set(topic, existing);

      if (existing.length === 1) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
      }
    }

    if (!this.running) {
      this.running = true;
      await this.consumer.run({
        eachMessage: async (payload) => {
          const topicHandlers = this.handlers.get(payload.topic);
          if (!topicHandlers || topicHandlers.length === 0) {
            this.logger.warn(`No handler registered for topic: ${payload.topic}`);
            return;
          }

          const results = await Promise.allSettled(topicHandlers.map((h) => h(payload)));

          results.forEach((r, i) => {
            if (r.status === "rejected") {
              this.logger.error(`Handler #${i} failed for topic ${payload.topic}: ${r.reason}`);
            }
          });
        },
      });
    }
  }

  async onModuleDestroy() {
    if (this.connected) await this.consumer.disconnect();
  }
}
