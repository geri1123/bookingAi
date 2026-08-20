import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KafkaConfig } from "kafkajs";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get serviceName(): string {
    return "billing-service";
  }

  get kafkaBroker(): string {
    return this.configService.get<string>("KAFKA_BROKER", "localhost:9092");
  }


  get kafkaClientConfig(): KafkaConfig {
    const username = this.configService.get<string>("KAFKA_SASL_USERNAME");
    const password = this.configService.get<string>("KAFKA_SASL_PASSWORD");
    const brokers = [this.kafkaBroker];

    if (!username || !password) {
      return { brokers };
    }

    const mechanism = this.configService.get<"plain" | "scram-sha-256" | "scram-sha-512">(
      "KAFKA_SASL_MECHANISM",
      "scram-sha-256",
    );
    return { brokers, ssl: true, sasl: { mechanism, username, password } as KafkaConfig["sasl"] };
  }

  get port(): number {
    return Number(this.configService.get<number>("PORT", 8083));
  }

  get internalApiKey(): string {
    const key = this.configService.get<string>("INTERNAL_API_KEY");
    if (!key || key.length < 16) {
      throw new Error("INTERNAL_API_KEY duhet te jete i vendosur (min 16 karaktere).");
    }
    return key;
  }

  get paddleWebhookSecret(): string {
    const secret = this.configService.get<string>("PADDLE_WEBHOOK_SECRET");
    if (!secret) {
      throw new Error("PADDLE_WEBHOOK_SECRET duhet te jete i vendosur (nga Paddle Dashboard).");
    }
    return secret;
  }
  get coreServiceUrl(): string {
    return this.configService.getOrThrow<string>("CORE_SERVICE_URL");
  }

  get jwtAccessSecret(): string {
    const secret = this.configService.get<string>("JWT_ACCESS_SECRET");
    if (!secret || secret.length < 32) {
      throw new Error(
        "JWT_ACCESS_SECRET duhet te jete i vendosur (min 32 karaktere) — I NJEJTI si te core-service.",
      );
    }
    return secret;
  }
}