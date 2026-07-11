import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException {

  constructor(
    code: string,
    params: Record<string, unknown> = {},
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {

    super(
      {
        success: false,
        code,
        params,
      },
      status,
    );

  }

}