import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class AcceptInvitationRegisterDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  @MinLength(3, { message: msg(ErrorCode.FIELD_MIN_LENGTH, { min: 3 }) })
  username!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  firstName!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  lastName!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  @MinLength(8, { message: msg(ErrorCode.FIELD_MIN_LENGTH, { min: 8 }) })
  password!: string;
}