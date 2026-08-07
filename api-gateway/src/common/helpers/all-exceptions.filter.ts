import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { buildErrorResponse } from "../helpers/error-response.helper";
import { GatewayErrorCode } from "../errors/error-codes";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: string = GatewayErrorCode.INTERNAL_SERVER_ERROR;
    let message = "Diçka shkoi keq.";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === "string" ? res : exception.message;
      code = this.defaultCodeFor(status);
    }

    response.status(status).json(buildErrorResponse(request, code, message));
  }

  private defaultCodeFor(status: number): string {
    const map: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: GatewayErrorCode.ROUTE_NOT_FOUND,
      409: "CONFLICT",
    };
    return map[status] ?? GatewayErrorCode.INTERNAL_SERVER_ERROR;
  }
}