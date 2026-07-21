import { IsInt, IsString, Matches, Max, Min } from "class-validator";

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  day!: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "startTime duhet te jete ne formatin HH:mm" })
  startTime!: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "endTime duhet te jete ne formatin HH:mm" })
  endTime!: string;
}
