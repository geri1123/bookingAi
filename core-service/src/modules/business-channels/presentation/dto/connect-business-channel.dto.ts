import { IsIn, IsNotEmpty, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";

export class ConnectBusinessChannelDto {
  // phone_number_id (WhatsApp) / page_id (Messenger) / ig_business_account_id (Instagram)
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  externalAccountId!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  accessToken!: string;
}

export class ToggleChannelAiDto {
  @IsIn([true, false], { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "boolean" }) })
  aiEnabled!: boolean;
}
