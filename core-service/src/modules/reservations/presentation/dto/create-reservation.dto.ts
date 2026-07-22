import { IsDateString, IsEmail, IsInt, IsOptional, IsString, IsUUID, Matches, Min, MinLength } from "class-validator";

export class CreateReservationDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @Matches(/^\+?[0-9]{6,15}$/, { message: "phone duhet te jete numer valid (6-15 shifra, + opsionale)" })
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsUUID()
  serviceId!: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;

  @IsOptional()
  @IsUUID()
  resourceId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  partySize?: number;

  @IsDateString()
  startTime!: string; // ISO 8601, p.sh. "2026-07-23T18:00:00.000Z"

  @IsOptional()
  @IsDateString()
  endTime?: string; // vetem nese pricingUnit != FIXED (p.sh. hotel)
}
