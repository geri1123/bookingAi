import { Matches } from "class-validator";

export class CancelReservationDto {
  @Matches(/^\+?[0-9]{6,15}$/, { message: "phone duhet te jete numer valid (6-15 shifra, + opsionale)" })
  phone!: string;
}
