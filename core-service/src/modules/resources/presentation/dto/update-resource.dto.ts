import { IsEnum, IsInt, IsOptional, IsString, Min, MinLength } from "class-validator";
import { ResourceType } from "../../domain/entities/resource.entity";

export class UpdateResourceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;

  @IsOptional()
  @IsInt()
  @Min(1)
  capacity?: number;
}
