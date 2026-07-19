import { IsEmail, IsNotEmpty } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class ResendVerificationDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsEmail({}, { message: msg(ErrorCode.FIELD_INVALID_EMAIL) })
  email!: string;
}