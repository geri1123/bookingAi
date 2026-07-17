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

  get jwtAccessSecret(): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_ACCESS_SECRET must be set and at least 32 characters. ' +
        'Generate one: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
      );
    }
    return secret;
  }

  get jwtRefreshSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_REFRESH_SECRET must be set and at least 32 characters. ' +
        'Generate one: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"',
      );
    }
    if (secret === this.jwtAccessSecret) {
      throw new Error('JWT_REFRESH_SECRET must differ from JWT_ACCESS_SECRET.');
    }
    return secret;
  }

  get jwtAccessTtl(): string {
    return this.configService.get<string>('JWT_ACCESS_TTL', '15m');
  }

  get jwtRefreshTtlDefault(): string {
    return this.configService.get<string>('JWT_REFRESH_TTL_DEFAULT', '4h');
  }

  get jwtRefreshTtlRememberMe(): string {
    return this.configService.get<string>('JWT_REFRESH_TTL_REMEMBER_ME', '2d');
  }
}
