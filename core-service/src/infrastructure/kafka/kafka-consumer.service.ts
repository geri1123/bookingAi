// src/infrastructure/kafka/kafka-consumer.service.ts
import { Injectable, Logger, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { AppConfigService } from '../../config/config.service';

type MessageHandler = (payload: EachMessagePayload) => Promise<void>;

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy, OnApplicationBootstrap {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private kafka: Kafka;
  private consumer: Consumer;
  private connected = false;
  private running = false;

  // routing: topic -> LISTA e handlers te biznesit qe jane regjistruar per te
  private readonly handlers = new Map<string, MessageHandler[]>();

  private registrationChain: Promise<void> = Promise.resolve();

  constructor(private appConfig: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.appConfig.serviceName,
      brokers: [this.appConfig.kafkaBroker],
    });
    this.consumer = this.kafka.consumer({ groupId: this.appConfig.serviceName });
  }

  async subscribe(topics: string[], handler: MessageHandler): Promise<void> {

    this.registrationChain = this.registrationChain.then(() => this.registerTopics(topics, handler));
    return this.registrationChain;
  }

  private async registerTopics(topics: string[], handler: MessageHandler): Promise<void> {
    if (!this.connected) {
      await this.consumer.connect();
      this.connected = true;
    }

    for (const topic of topics) {
      const existing = this.handlers.get(topic) ?? [];
      existing.push(handler);
      this.handlers.set(topic, existing);

      // consumer.subscribe() te Kafka thirret VETEM here e pare per kete topic
      if (existing.length === 1) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
      } else {
        this.logger.log(`Topic ${topic} tani ka ${existing.length} handlers te regjistruar.`);
      }
    }
  }


  async onApplicationBootstrap(): Promise<void> {
    await this.registrationChain;

    if (this.running || this.handlers.size === 0) return;

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
          if (r.status === 'rejected') {
            this.logger.error(`Handler #${i} failed for topic ${payload.topic}: ${r.reason}`);
          }
        });
      },
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.connected) await this.consumer.disconnect();
  }
}