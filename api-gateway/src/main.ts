import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { getGatewayConfig } from "./config/gateway.config";
import { correlationIdMiddleware } from "./middleware/correlation-id.middleware";
import { createRateLimitMiddleware } from "./middleware/rate-limit.middleware";
import { createServiceProxy } from "./proxy/proxy.factory";
import { RateLimitService } from "./redis/rate-limit.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = getGatewayConfig();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  app.use(correlationIdMiddleware);


  const rateLimitService = app.get(RateLimitService);
  app.use(createRateLimitMiddleware(rateLimitService, config.rateLimit.windowMs, config.rateLimit.maxRequests));

  for (const route of config.routes) {
    app.use(createServiceProxy(route));
    console.log(`[gateway] ${route.prefix}/* -> ${route.target}`);
  }

  await app.listen(config.port);
  console.log(`API Gateway running on port ${config.port}`);
}
bootstrap();
