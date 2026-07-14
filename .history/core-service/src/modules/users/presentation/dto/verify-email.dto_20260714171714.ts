import { IsNotEmpty, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";

export class VerifyEmailDto {
  @IsNotEmpty({
    message: msg("FIELD_REQUIRED"),
  })
  @IsString({
    message: msg("FIELD_INVALID_TYPE", {
      type: "string",
    }),
  })
  token!: string;
}
