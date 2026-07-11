import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaBroker(): string {
    return this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
  }

  get serviceName(): string {
    return this.configService.get<string>('SERVICE_NAME', 'unknown-service');
  }
   get port(): number {
    return Number(this.configService.get<number>('PORT', 8080));
  }
   get clientBaseUrl(): string {
    return this.configService.get<string>('CLIENT_BASE_URL', 'http://localhost:3000');
  }
get corsOrigins(): string[] {
  const origins = this.configService.get<string>('CORS_ORIGINS', this.clientBaseUrl);
  return origins.split(',').map(o => o.trim());
}
}