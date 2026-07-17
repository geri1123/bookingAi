import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";
import { BusinessType, BusinessLanguage } from "../../domain/entities/business.entity";

export class CreateBusinessDto {
  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  name!: string;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsEnum(BusinessType, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "BusinessType" }) })
  type!: BusinessType;

  @IsNotEmpty({ message: msg(ErrorCode.FIELD_REQUIRED) })
  @IsEnum(BusinessLanguage, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "BusinessLanguage" }) })
  language!: BusinessLanguage;

  @IsOptional()
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: msg(ErrorCode.FIELD_INVALID_EMAIL) })
  email?: string;

  @IsOptional()
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  address?: string;

  @IsOptional()
  @IsBoolean({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "boolean" }) })
  rememberMe?: boolean;
}