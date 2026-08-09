import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";
 
export class ResetPasswordDto {
  @IsNotEmpty({
    message: msg(ErrorCode.FIELD_REQUIRED),
  })
  @IsString({
    message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }),
  })
  token!: string;
 
  @IsNotEmpty({
    message: msg(ErrorCode.FIELD_REQUIRED),
  })
  @IsString({
    message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }),
  })
  @MinLength(8, {
    message: msg(ErrorCode.FIELD_MIN_LENGTH, { min: 8 }),
  })
  newPassword!: string;
}
 