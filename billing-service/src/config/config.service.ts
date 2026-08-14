import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get serviceName(): string {
    return "billing-service";
  }

  get kafkaBroker(): string {
    return this.configService.get<string>("KAFKA_BROKER", "localhost:9092");
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