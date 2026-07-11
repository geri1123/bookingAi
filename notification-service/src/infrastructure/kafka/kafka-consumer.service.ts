// src/infrastructure/kafka/kafka-consumer.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { AppConfigService } from '../../config/config.service';

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private kafka: Kafka;
  private consumer: Consumer;
  private connected = false;

  constructor(private appConfig: AppConfigService) {
    this.kafka = new Kafka({
      clientId: this.appConfig.serviceName,
      brokers: [this.appConfig.kafkaBroker],
    });
    this.consumer = this.kafka.consumer({ groupId: this.appConfig.serviceName });
  }

  async subscribe(topics: string[], handler: (payload: EachMessagePayload) => Promise<void>) {
    if (!this.connected) {
      await this.consumer.connect();
      this.connected = true;
    }
    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
    }
    await this.consumer.run({ eachMessage: handler });
  }

  async onModuleDestroy() {
    if (this.connected) await this.consumer.disconnect();
  }
}