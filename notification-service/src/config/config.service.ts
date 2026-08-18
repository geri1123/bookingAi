import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from 'kafkajs';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaBroker(): string {
    return this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
  }


  get kafkaClientConfig(): KafkaConfig {
    const username = this.configService.get<string>('KAFKA_SASL_USERNAME');
    const password = this.configService.get<string>('KAFKA_SASL_PASSWORD');
    const brokers = [this.kafkaBroker];

    if (!username || !password) {
      return { brokers };
    }

    const mechanism = this.configService.get<'plain' | 'scram-sha-256' | 'scram-sha-512'>(
      'KAFKA_SASL_MECHANISM',
      'scram-sha-256',
    );
    return { brokers, ssl: true, sasl: { mechanism, username, password } as KafkaConfig['sasl'] };
  }

  get serviceName(): string {
    return this.configService.get<string>('SERVICE_NAME', 'notification-service');
  }

  get port(): number {
    return Number(this.configService.get<number>('PORT', 8080));
  }

  get clientBaseUrl(): string {
    return this.configService.get<string>('CLIENT_BASE_URL', 'http://localhost:3000');
  }

  // ---- Resend ----
  get resendApiKey(): string {
    return this.configService.getOrThrow<string>('RESEND_API_KEY');
  }

  get resendFromEmail(): string {
    return this.configService.get<string>('RESEND_FROM_EMAIL', 'no-reply@yourapp.com');
  }

  // ---- Redis (BullMQ) ----
  get redisUrl(): string {
  return this.configService.getOrThrow<string>('REDIS_URL');
}
  get redisHost(): string {
    return this.configService.get<string>('REDIS_HOST', 'localhost');
  }

  get redisPort(): number {
    return Number(this.configService.get<number>('REDIS_PORT', 6379));
  }

  get redisPassword(): string | undefined {
    return this.configService.get<string>('REDIS_PASSWORD');
  }



}
