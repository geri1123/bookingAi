import { IsNotEmpty, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class VerifyEmailDto {
  @IsNotEmpty({
    message: msg(ErrorCode.FIELD_REQUIRED),
  })
  @IsString({
    message: msg(ErrorCode.FIELD_INVALID_TYPE, {
      type: "string",
    }),
  })
  token!: string;
}