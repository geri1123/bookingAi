import { IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(5)
  duration?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}