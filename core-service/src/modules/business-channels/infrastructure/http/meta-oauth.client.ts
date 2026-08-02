import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";

@Injectable()
export class MetaOAuthClient {
  private readonly logger = new Logger(MetaOAuthClient.name);

  constructor(private readonly appConfig: AppConfigService) {}

  // Kembimi i "code" qe kthen JS SDK (Embedded Signup) me nje access token te perdorshem nga backend.
  async exchangeCodeForToken(code: string): Promise<string> {
    const url = new URL(`${this.appConfig.metaGraphApiBaseUrl}/oauth/access_token`);
    url.searchParams.set("client_id", this.appConfig.metaAppId);
    url.searchParams.set("client_secret", this.appConfig.metaAppSecret);
    url.searchParams.set("code", code);

    const response = await fetch(url.toString());
    const json = (await response.json().catch(() => null)) as { access_token?: string; error?: unknown };

    if (!response.ok || !json?.access_token) {
      this.logger.error(`Kembimi i code-it deshtoi: ${JSON.stringify(json)}`);
      throw new BadRequestException("S'u arrit te lidhet me Meta - code i pavlefshem ose i skaduar.");
    }

    return json.access_token;
  }

  // I thote Meta-s "dergoji webhook-et per kete WABA/numer te app-it tim"
  async subscribeAppToWaba(wabaId: string, accessToken: string): Promise<void> {
    const url = `${this.appConfig.metaGraphApiBaseUrl}/${wabaId}/subscribed_apps`;
    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      this.logger.error(`Subscribe i WABA deshtoi: ${body}`);
      throw new BadRequestException("S'u arrit te aktivizohet webhook-u per kete WhatsApp Business Account.");
    }
  }
}
