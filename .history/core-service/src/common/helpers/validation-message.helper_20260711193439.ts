export function msg(code: string, params?: Record<string, unknown>): string {
  return JSON.stringify({ code, params: params ?? {} });
}