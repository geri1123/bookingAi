import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = configService.corsOrigins;
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: ${origin} not allowed`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  });

  const port = configService.port;
  await app.listen(port);
  console.log(`ai-service running on port ${port}`);
}
bootstrap();