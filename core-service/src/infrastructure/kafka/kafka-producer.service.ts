// src/infrastructure/kafka/kafka-producer.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { AppConfigService } from '../../config/config.service';

export interface BatchMessage {
  key: string;
  value: string;
}

export interface TopicBatch {
  topic: string;
  messages: BatchMessage[];
}

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor(private appConfig: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.appConfig.serviceName,
      brokers: [this.appConfig.kafkaBroker],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(topic: string, key: string, payload: unknown) {
    await this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(payload) }],
    });
  }

  
  async sendBatch(topicBatches: TopicBatch[]): Promise<void> {
    if (topicBatches.length === 0) return;

    await this.producer.sendBatch({
      topicMessages: topicBatches.map(({ topic, messages }) => ({
        topic,
        messages: messages.map((m) => ({ key: m.key, value: m.value })),
      })),
    });
  }
}