// src/common/filters/all-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let body: Record<string, unknown> = {
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === "object" && res !== null && "code" in res) {
        // vjen tashmë e formatuar (AppException, ValidationPipe exceptionFactory)
        body = res as Record<string, unknown>;
      } else {
        // HttpException standarde e Nest (p.sh. NotFoundException pa code)
        body = {
          success: false,
          code: this.defaultCodeFor(status),
          message: typeof res === "string" ? res : exception.message,
        };
      }
    }

    response.status(status).json({
      ...body,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private defaultCodeFor(status: number): string {
    const map: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHORIZED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      409: "CONFLICT",
    };
    return map[status] ?? "INTERNAL_SERVER_ERROR";
  }
}