import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { AiSettings, AiSettingsRepository, UpsertAiSettingsInput } from "../../domain/repositories/ai-settings.repository";

@Injectable()
export class PrismaAiSettingsRepository extends AiSettingsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByBusinessId(businessId: string): Promise<AiSettings | null> {
    return this.prisma.aiSettings.findUnique({ where: { businessId } });
  }

  async upsert(businessId: string, data: UpsertAiSettingsInput): Promise<AiSettings> {
    return this.prisma.aiSettings.upsert({
      where: { businessId },
      create: {
        businessId,
        systemPrompt: data.systemPrompt ?? null,
        isEnabled: data.isEnabled ?? true,
      },
      update: {
        ...(data.systemPrompt !== undefined ? { systemPrompt: data.systemPrompt } : {}),
        ...(data.isEnabled !== undefined ? { isEnabled: data.isEnabled } : {}),
      },
    });
  }
}