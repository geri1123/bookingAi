import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { msg } from "../../../../common/helpers/validation-message.helper";
import { ErrorCode } from "../../../../common/errors/error-codes";
import { BusinessType, BusinessLanguage } from "../../domain/entities/business.entity";

export class UpdateBusinessDto {
  @IsOptional()
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  name?: string;

  @IsOptional()
  @IsEnum(BusinessType, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "BusinessType" }) })
  type?: BusinessType;

  @IsOptional()
  @IsEnum(BusinessLanguage, { message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "BusinessLanguage" }) })
  language?: BusinessLanguage;

  @IsOptional()
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: msg(ErrorCode.FIELD_INVALID_EMAIL) })
  email?: string;

  @IsOptional()
  @IsString({ message: msg(ErrorCode.FIELD_INVALID_TYPE, { type: "string" }) })
  address?: string;
}