
import { Request } from "express";

export interface ErrorResponseBody {
  success: false;
  code: string;
  message: string;
  path: string;
  timestamp: string;
}

export function buildErrorResponse(req: Request, code: string, message: string): ErrorResponseBody {
  return {
    success: false,
    code,
    message,
    path: req.originalUrl ?? req.url,
    timestamp: new Date().toISOString(),
  };
}