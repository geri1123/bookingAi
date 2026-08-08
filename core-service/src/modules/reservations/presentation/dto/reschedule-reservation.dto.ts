import { IsDateString, IsOptional, Matches } from "class-validator";

export class RescheduleReservationDto {
  // Kerkohet per te verifikuar qe kerkesa vjen VERTET nga klienti pronar i rezervimit,
  // jo nga dikush qe ka hamendesuar/marre ID-ne e rezervimit.
  @Matches(/^\+?[0-9]{6,15}$/, { message: "phone duhet te jete numer valid (6-15 shifra, + opsionale)" })
  phone!: string;

  @IsDateString()
  startTime!: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;
}
