import { ValidationError } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export interface FormattedFieldError {
  code: string;
  params?: Record<string, unknown>;
}

export function formatValidationErrors(
 errors: ValidationError[]
): Record<string,FormattedFieldError[]> {


 const formatted:Record<string,FormattedFieldError[]>={};


 for(const err of errors){

   if(!err.constraints)
      continue;


   formatted[err.property] = Object
   .values(err.constraints)
   .map(rawMessage=>{


      try{

        const parsed = JSON.parse(rawMessage);


        if(
          parsed &&
          parsed.code
        ){
          return {
            code:parsed.code,
            params:parsed.params ?? {}
          };
        }


      }catch{}



      return {
        code:"FIELD_INVALID_TYPE",
        params:{}
      };


   });

 }


 return formatted;

}

export function throwValidationErrors(
  errors: ValidationError[],
  extraErrors?: Record<string, FormattedFieldError[]>,
) {
  const formatted = formatValidationErrors(errors);

  if (extraErrors) {
    Object.assign(formatted, extraErrors);
  }

  if (Object.keys(formatted).length > 0) {
    throw new BadRequestException({
      success: false,
      code: 'VALIDATION_FAILED',
      errors: formatted,
    });
  }
}