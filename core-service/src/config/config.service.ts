import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from 'kafkajs';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get kafkaBroker(): string {
    return this.configService.get<string>('KAFKA_BROKERS', 'localhost:9092');
  }

  // Local/dev Kafka (docker-compose.yml) is plaintext, no auth. Managed
  // Kafka (Upstash, Confluent, Aiven...) needs SASL_SSL — set
  // KAFKA_SASL_USERNAME/KAFKA_SASL_PASSWORD in production and this
  // switches on automatically; leave them unset for local dev.
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
get kafkaTopicReplicationFactor(): number {
  return Number(this.configService.get<number>('KAFKA_TOPIC_REPLICATION_FACTOR', 1));
}
  get serviceName(): string {
    return this.configService.get<string>('SERVICE_NAME', 'unknown-service');
  }
   get redisUrl(): string {
    return this.configService.get<string>("REDIS_URL", "redis://localhost:6379");
  }


  get port(): number {
    return Number(this.configService.get<number>('PORT', 8080));
  }

  get clientBaseUrl(): string {
    return this.configService.get<string>('CLIENT_BASE_URL', 'http://localhost:3000');
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

  get cloudinaryUrl(): string {
    return this.configService.get<string>('CLOUDINARY_URL')!;
  }

  // Celes AES-256 (32 bytes = 64 hex chars) per enkriptimin e token-eve te WhatsApp/Messenger/Instagram.
  get channelTokenEncryptionKey(): string {
    const key = this.configService.get<string>('CHANNEL_TOKEN_ENCRYPTION_KEY');
    if (!key || key.length !== 64) {
      throw new Error(
        'CHANNEL_TOKEN_ENCRYPTION_KEY must be set and be exactly 64 hex characters (32 bytes). ' +
        'Generate one: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      );
    }
    return key;
  }

  // I njejti sekret qe pret InternalApiKeyGuard te communication-service/ai-service
  get internalApiKey(): string {
    const key = this.configService.get<string>('INTERNAL_API_KEY');
    if (!key || key.length < 16) {
      throw new Error('INTERNAL_API_KEY must be set and be at least 16 characters.');
    }
    return key;
  }

  // Meta (WhatsApp/Messenger/Instagram) - OAuth flow (connect-business-channel)
  get metaAppId(): string {
    const id = this.configService.get<string>('META_APP_ID');
    if (!id) {
      throw new Error('META_APP_ID must be set (nga Meta App Dashboard).');
    }
    return id;
  }

  get metaAppSecret(): string {
    const secret = this.configService.get<string>('META_APP_SECRET');
    if (!secret) {
      throw new Error('META_APP_SECRET must be set (used for OAuth token exchange).');
    }
    return secret;
  }

  get metaGraphApiVersion(): string {
    return this.configService.get<string>('META_GRAPH_API_VERSION', 'v21.0');
  }

  get metaGraphApiBaseUrl(): string {
    return `https://graph.facebook.com/${this.metaGraphApiVersion}`;
  }

  
  getRateLimit(name: string, defaultMaxRequests: number, defaultWindowMs: number): { maxRequests: number; windowMs: number } {
    const upperName = name.toUpperCase().replace(/-/g, "_");
    return {
      maxRequests: Number(this.configService.get<number>(`RATE_LIMIT_${upperName}_MAX`, defaultMaxRequests)),
      windowMs: Number(this.configService.get<number>(`RATE_LIMIT_${upperName}_WINDOW_MS`, defaultWindowMs)),
    };
  }
}