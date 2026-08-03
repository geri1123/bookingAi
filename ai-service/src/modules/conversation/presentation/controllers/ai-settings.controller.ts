import { Body, Controller, Get, HttpCode, HttpStatus, Put, UseGuards } from "@nestjs/common";
import { BusinessContextGuard, CurrentUser, JwtPayload, Roles } from "@bookingai/auth";
import { AiSettingsRepository } from "../../domain/repositories/ai-settings.repository";
import { UpsertAiSettingsDto } from "../dto/upsert-ai-settings.dto";

@UseGuards(BusinessContextGuard) 
@Roles("OWNER", "MANAGER")
@Controller("business/ai-settings")
export class AiSettingsController {
  constructor(private readonly aiSettingsRepo: AiSettingsRepository) {}

  @Get()
  async get(@CurrentUser() user: JwtPayload) {
    const settings = await this.aiSettingsRepo.findByBusinessId(user.businessId!);
    return { success: true, settings };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async update(@Body() dto: UpsertAiSettingsDto, @CurrentUser() user: JwtPayload) {
    const settings = await this.aiSettingsRepo.upsert(user.businessId!, dto);
    return { success: true, settings };
  }
}