export interface AiSettings {
  businessId: string;
  systemPrompt: string | null;
  language: string | null;
  isEnabled: boolean;
}

export interface UpsertAiSettingsInput {
  systemPrompt?: string | null;
  isEnabled?: boolean;
}

export abstract class AiSettingsRepository {
  abstract findByBusinessId(businessId: string): Promise<AiSettings | null>;
  abstract upsert(businessId: string, data: UpsertAiSettingsInput): Promise<AiSettings>;
}