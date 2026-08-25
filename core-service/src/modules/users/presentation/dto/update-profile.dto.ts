import { IsOptional, IsString, Matches, Length, IsIn } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_.]{3,20}$/)
  username?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  lastName?: string;

  @IsOptional()
  @IsIn(["en", "sq", "it", "de", "es"])
  preferredLocale?: string;
}