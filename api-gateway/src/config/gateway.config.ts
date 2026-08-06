export interface ServiceRoute {
  /** Prefix publik në gateway, p.sh. "/core" */
  prefix: string;
 
  target: string;
}

export interface GatewayConfig {
  port: number;
  corsOrigins: string[];
  redisUrl: string;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  routes: ServiceRoute[];
}

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Env var ${name} mungon dhe s'ka fallback.`);
  }
  return value;
}

export function getGatewayConfig(): GatewayConfig {
  const clientBaseUrl = process.env.CLIENT_BASE_URL ?? "http://localhost:3000";

  return {
    port: Number(process.env.PORT ?? 8000),
    corsOrigins: (process.env.CORS_ORIGINS ?? clientBaseUrl).split(",").map((o) => o.trim()),
    redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
    rateLimit: {
      windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
      maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120),
    },
    routes: [
   
      { prefix: "/core", target: requireEnv("CORE_SERVICE_URL", "http://localhost:8080") },
      { prefix: "/ai", target: requireEnv("AI_SERVICE_URL", "http://localhost:8082") },
      { prefix: "/comm", target: requireEnv("COMMUNICATION_SERVICE_URL", "http://localhost:8083") },
     
    ],
  };
}
