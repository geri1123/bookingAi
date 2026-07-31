import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { AiSettings, AiSettingsRepository } from "../../domain/repositories/ai-settings.repository";

@Injectable()
export class PrismaAiSettingsRepository extends AiSettingsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findByBusinessId(businessId: string): Promise<AiSettings | null> {
    return this.prisma.aiSettings.findUnique({ where: { businessId } });
  }
}
