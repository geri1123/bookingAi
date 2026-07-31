import { IsString, IsUUID, MinLength } from "class-validator";

export class HandleMessageDto {
  @IsUUID()
  businessId!: string;

  @IsString()
  @MinLength(6)
  customerPhone!: string;

  @IsString()
  @MinLength(1)
  text!: string;
}
