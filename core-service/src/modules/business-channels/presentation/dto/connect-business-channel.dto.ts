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

// Te dhenat qe kthen popup-i i Meta JS SDK pas Embedded Signup (jo te shkruara
// nga perdoruesi - kapen automatikisht nga eventi postMessage WA_EMBEDDED_SIGNUP
// dhe kalimi i "code" ne callback).
export class CompleteWhatsappEmbeddedSignupDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  code!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  wabaId!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  phoneNumberId!: string;
}

// Messenger + Instagram (te dyja bashke, ne 1 popup) - Facebook Login for
// Business, response_type: 'code'.
export class CompleteMetaLoginDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  code!: string;
}
