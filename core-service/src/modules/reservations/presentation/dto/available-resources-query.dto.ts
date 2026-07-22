import { IsDateString, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { ResourceType } from "../../../resources/domain/entities/resource.entity";

export class AvailableResourcesQueryDto {
  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  partySize?: number;

  @IsOptional()
  @IsEnum(ResourceType)
  resourceType?: ResourceType;
}