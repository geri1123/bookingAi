import { IsBoolean, IsOptional, IsString, MaxLength } from "class-validator";

export class UpsertAiSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(300, { message: "systemPrompt s'mund te kaloje 300 karaktere." })
  systemPrompt?: string | null;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}