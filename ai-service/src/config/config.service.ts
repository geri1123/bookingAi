import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>("PORT", 8082));
  }

  // URL bazë e core-service, p.sh. http://localhost:8080
  get coreServiceUrl(): string {
    return this.configService.get<string>("CORE_SERVICE_URL", "http://localhost:8080");
  }

  get anthropicApiKey(): string {
    const key = this.configService.get<string>("ANTHROPIC_API_KEY");
    if (!key) {
      throw new Error("ANTHROPIC_API_KEY duhet te jete i vendosur.");
    }
    return key;
  }

  get anthropicModel(): string {
    return this.configService.get<string>("ANTHROPIC_MODEL", "claude-sonnet-4-6");
  }

  get defaultLanguage(): string {
    return this.configService.get<string>("DEFAULT_AI_LANGUAGE", "sq");
  }

  // Sa mesazhe te fundit mbahen ne context per LLM (menaxhim kosti/tokenesh)
  get maxContextMessages(): number {
    return Number(this.configService.get<number>("AI_MAX_CONTEXT_MESSAGES", 20));
  }

  // Sekret i ndare per te verifikuar qe thirrjet te /internal/* vijne
  // vertet nga communication-service, jo nga kushdo qe e gjen URL-ne.
  get internalApiKey(): string {
    const key = this.configService.get<string>("INTERNAL_API_KEY");
    if (!key || key.length < 16) {
      throw new Error("INTERNAL_API_KEY duhet te jete i vendosur (min 16 karaktere).");
    }
    return key;
  }
}
