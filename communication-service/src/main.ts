import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { AppConfigService } from "./config/config.service";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const configService = app.get(AppConfigService);

  app.use(cookieParser());

  await app.listen(configService.port);
  console.log(`communication-service running on port ${configService.port}`);
}
bootstrap();