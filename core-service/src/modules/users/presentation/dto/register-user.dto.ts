import { 
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from "class-validator";

import { msg } from "../../../../common/helpers/validation-message.helper";


export class RegisterUserDto {


  @IsNotEmpty({
    message: msg("FIELD_REQUIRED")
  })
  @IsString({
    message: msg("FIELD_INVALID_TYPE", {
      type:"string"
    })
  })
  @MinLength(3,{
    message: msg("FIELD_MIN_LENGTH",{
      min:3
    })
  })
  username!: string;



  @IsNotEmpty({
    message: msg("FIELD_REQUIRED")
  })
  @IsString({
    message: msg("FIELD_INVALID_TYPE",{
      type:"string"
    })
  })
  firstName!: string;



  @IsNotEmpty({
    message: msg("FIELD_REQUIRED")
  })
  @IsString({
    message: msg("FIELD_INVALID_TYPE",{
      type:"string"
    })
  })
  lastName!: string;



  @IsNotEmpty({
    message: msg("FIELD_REQUIRED")
  })
  @IsEmail({},{
    message: msg("FIELD_INVALID_EMAIL")
  })
  email!: string;



  @IsNotEmpty({
    message: msg("FIELD_REQUIRED")
  })
  @IsString({
    message: msg("FIELD_INVALID_TYPE",{
      type:"string"
    })
  })
  @MinLength(8,{
    message: msg("FIELD_MIN_LENGTH",{
      min:8
    })
  })
  password!: string;

}