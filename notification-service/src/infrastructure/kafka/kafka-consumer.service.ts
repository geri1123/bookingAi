// src/infrastructure/kafka/kafka-consumer.service.ts
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { AppConfigService } from '../../config/config.service';

type MessageHandler = (payload: EachMessagePayload) => Promise<void>;

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private kafka: Kafka;
  private consumer: Consumer;
  private connected = false;
  private running = false;

  // routing: topic -> handler i biznesit qe eshte regjistruar per te
  private readonly handlers = new Map<string, MessageHandler>();

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
      if (this.handlers.has(topic)) {
        // mbrojtje kunder bug-ut: dy consumer te ndryshem qe subscribe-ojne te njejtin topic
        this.logger.warn(`Topic ${topic} already has a handler registered — overwriting.`);
      }
      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.handlers.set(topic, handler);
    }

    // run() thirret VETEM NJE HERE per gjithe jeten e aplikacionit
    if (!this.running) {
      this.running = true;
      await this.consumer.run({
        eachMessage: async (payload) => {
          const handler = this.handlers.get(payload.topic);
          if (!handler) {
            this.logger.warn(`No handler registered for topic: ${payload.topic}`);
            return;
          }
          await handler(payload);
        },
      });
    }
  }

  async onModuleDestroy() {
    if (this.connected) await this.consumer.disconnect();
  }
}