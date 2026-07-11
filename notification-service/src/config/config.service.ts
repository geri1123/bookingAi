import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaBroker(): string {
    return this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
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

  get corsOrigins(): string[] {
    const origins = this.configService.get<string>('CORS_ORIGINS', this.clientBaseUrl);
    return origins.split(',').map((o) => o.trim());
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
