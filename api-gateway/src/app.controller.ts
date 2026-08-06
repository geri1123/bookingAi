import { Controller, Get } from "@nestjs/common";
import { getGatewayConfig } from "./config/gateway.config";

@Controller()
export class AppController {
  @Get("health")
  health() {
    const config = getGatewayConfig();
    return {
      status: "ok",
      routes: config.routes.map((r) => ({ prefix: r.prefix, target: r.target })),
    };
  }
}