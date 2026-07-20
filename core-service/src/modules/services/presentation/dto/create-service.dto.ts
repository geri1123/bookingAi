import { IsEnum, IsNumber, IsOptional, IsString, Min, MinLength, ValidateIf } from "class-validator";
import { ServicePricingUnit } from "../../domain/entities/service.entity";

export class CreateServiceDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ServicePricingUnit)
  pricingUnit!: ServicePricingUnit;

  @ValidateIf((dto) => dto.pricingUnit === ServicePricingUnit.FIXED)
  @IsNumber()
  @Min(5)
  duration?: number;

  @IsNumber()
  @Min(0)
  price!: number;
}