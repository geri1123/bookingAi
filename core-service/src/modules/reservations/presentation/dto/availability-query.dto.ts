import { IsOptional, IsUUID, Matches } from "class-validator";

export class AvailabilityQueryDto {
  @IsUUID()
  serviceId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: "date duhet te jete ne formatin YYYY-MM-DD" })
  date!: string;

  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
