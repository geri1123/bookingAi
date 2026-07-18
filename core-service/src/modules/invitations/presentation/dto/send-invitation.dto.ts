import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";
import { BusinessMemberRole } from "../../../business/domain/entities/business-member.entity";

export class SendInvitationDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsEmail({}, { message: msg(ErrorCode.FIELD_INVALID_EMAIL) })
  email!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsEnum(BusinessMemberRole, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "BusinessMemberRole" }) })
  role!: BusinessMemberRole;
}