import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get("PORT", 8082));
  }

  get serviceName(): string {
    return this.configService.get<string>("SERVICE_NAME", "communication-service");
  }

  get redisUrl(): string {
    return this.configService.get<string>("REDIS_URL", "redis://localhost:6379");
  }

  get coreServiceUrl(): string {
    return this.configService.get<string>("CORE_SERVICE_URL", "http://localhost:8080");
  }

  get aiServiceUrl(): string {
    return this.configService.get<string>("AI_SERVICE_URL", "http://localhost:8081");
  }

  get internalApiKey(): string {
    const key = this.configService.get<string>("INTERNAL_API_KEY");
    if (!key || key.length < 16) {
      throw new Error("INTERNAL_API_KEY must be set and be at least 16 characters.");
    }
    return key;
  }

  get metaWebhookVerifyToken(): string {
    const token = this.configService.get<string>("META_WEBHOOK_VERIFY_TOKEN");
    if (!token) throw new Error("META_WEBHOOK_VERIFY_TOKEN must be set.");
    return token;
  }

  get metaAppSecret(): string {
    const secret = this.configService.get<string>("META_APP_SECRET");
    if (!secret) throw new Error("META_APP_SECRET must be set.");
    return secret;
  }

  get metaGraphApiVersion(): string {
    return this.configService.get<string>("META_GRAPH_API_VERSION", "v21.0");
  }

  get metaGraphApiBaseUrl(): string {
    return `https://graph.facebook.com/${this.metaGraphApiVersion}`;
  }
}