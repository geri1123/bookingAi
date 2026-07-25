import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class UpdateBusinessLocationDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsNumber({}, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "number" }) })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsNumber({}, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "number" }) })
  @Min(-180)
  @Max(180)
  longitude!: number;
}