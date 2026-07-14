import { ErrorCode } from "../errors/error-codes";

export function msg(code: ErrorCode, params?: Record<string, unknown>): string {
  return JSON.stringify({ code, params: params ?? {} });
}