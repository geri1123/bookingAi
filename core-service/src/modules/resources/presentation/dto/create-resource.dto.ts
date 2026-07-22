import { IsEnum, IsInt, IsString, Min, MinLength } from "class-validator";
import { ResourceType } from "../../domain/entities/resource.entity";

export class CreateResourceDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsEnum(ResourceType)
  type!: ResourceType;

  @IsInt()
  @Min(1)
  capacity!: number;
}
