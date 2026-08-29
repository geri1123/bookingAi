import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class GoogleLoginDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  idToken!: string;

  @IsOptional()
  @IsBoolean({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "boolean" }) })
  rememberMe?: boolean;
}