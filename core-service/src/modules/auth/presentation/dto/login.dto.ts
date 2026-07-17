import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class LoginDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  identifier!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  password!: string;

  @IsOptional()
  @IsBoolean({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "boolean" }) })
  rememberMe?: boolean;
}