import { Injectable, Logger, HttpStatus } from "@nestjs/common";
import { AppConfigService } from "../../../../config/config.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessChannelErrorCode } from "../../domain/errors/business-channel-error-codes.enum";

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
      throw new AppException(BusinessChannelErrorCode.META_CODE_EXCHANGE_FAILED, {}, HttpStatus.BAD_REQUEST);
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
      throw new AppException(BusinessChannelErrorCode.META_WABA_SUBSCRIBE_FAILED, {}, HttpStatus.BAD_REQUEST);
    }
  }

  // Perdoret per Messenger/Instagram (Facebook Login for Business, jo Embedded
  // Signup i WhatsApp): merr Faqet (Pages) qe useri ka autorizuar gjate popup-it,
  // secila me Page Access Token-in e vet (jo-i-skaduar - qendron valid pa afat
  // derisa useri ta shkeputi) + llogarine Instagram te lidhur me te (nese ka).
  async listPagesForUser(userAccessToken: string): Promise<MetaPageInfo[]> {
    const url = new URL(`${this.appConfig.metaGraphApiBaseUrl}/me/accounts`);
    url.searchParams.set("fields", "id,name,access_token,instagram_business_account");
    url.searchParams.set("access_token", userAccessToken);

    const response = await fetch(url.toString());
    const json = (await response.json().catch(() => null)) as { data?: MetaPageInfo[]; error?: unknown };

    if (!response.ok || !json?.data) {
      this.logger.error(`Marrja e Faqeve (Pages) deshtoi: ${JSON.stringify(json)}`);
      throw new AppException(BusinessChannelErrorCode.META_PAGES_FETCH_FAILED, {}, HttpStatus.BAD_REQUEST);
    }

    return json.data;
  }

  // I thote Meta-s "dergoji webhook-et per kete Faqe te app-it tim" (Messenger).
  // Instagram e lidhur me te perdor te njejtin subscribe (nuk kerkon thirrje te veçante).
  async subscribePageToApp(pageId: string, pageAccessToken: string): Promise<void> {
    const url = new URL(`${this.appConfig.metaGraphApiBaseUrl}/${pageId}/subscribed_apps`);
    url.searchParams.set("subscribed_fields", "messages");

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { Authorization: `Bearer ${pageAccessToken}` },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      this.logger.error(`Subscribe i Faqes deshtoi: ${body}`);
      throw new AppException(BusinessChannelErrorCode.META_PAGE_SUBSCRIBE_FAILED, {}, HttpStatus.BAD_REQUEST);
    }
  }
}

export interface MetaPageInfo {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
}