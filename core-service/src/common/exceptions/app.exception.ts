import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "../errors/error-codes";

export class AppException extends HttpException {

  constructor(
    code: string,
    params: Record<string, unknown> = {},
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {

    const field = typeof params.field === "string" ? params.field : "_general";
    const { field: _omit, ...restParams } = params;

    super(
      {
        success: false,
        code: ErrorCode.VALIDATION_FAILED,
        errors: {
          [field]: [{ code, params: restParams }],
        },
      },
      status,
    );

  }

}