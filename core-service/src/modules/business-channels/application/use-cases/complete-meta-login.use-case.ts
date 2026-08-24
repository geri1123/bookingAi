import { Injectable, HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessChannelErrorCode } from "../../domain/errors/business-channel-error-codes.enum";
import { MetaOAuthClient } from "../../infrastructure/http/meta-oauth.client";
import { ConnectBusinessChannelUseCase } from "./connect-business-channel.use-case";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";

export interface CompleteMetaLoginInput {
  businessId: string;
  code: string; // nga FB.login() JS SDK, response_type: 'code'
}

export interface CompleteMetaLoginResult {
  messenger: { id: string; channel: ChannelType } | null;
  instagram: { id: string; channel: ChannelType } | null;
}

@Injectable()
export class CompleteMetaLoginUseCase {
  constructor(
    private readonly metaOAuthClient: MetaOAuthClient,
    private readonly connectChannelUseCase: ConnectBusinessChannelUseCase,
  ) {}

  async execute(input: CompleteMetaLoginInput): Promise<CompleteMetaLoginResult> {
    const userAccessToken = await this.metaOAuthClient.exchangeCodeForToken(input.code);
    const pages = await this.metaOAuthClient.listPagesForUser(userAccessToken);

    if (pages.length === 0) {
      throw new AppException(BusinessChannelErrorCode.META_NO_PAGES_FOUND, {}, HttpStatus.BAD_REQUEST);
    }

    
    const page = pages[0];

    await this.metaOAuthClient.subscribePageToApp(page.id, page.access_token);

    const messenger = await this.connectChannelUseCase.execute({
      businessId: input.businessId,
      channel: ChannelType.MESSENGER,
      externalAccountId: page.id,
      accessToken: page.access_token,
    });

    let instagram: { id: string; channel: ChannelType } | null = null;
    if (page.instagram_business_account?.id) {
      // Instagram Messaging (permes Facebook Login for Business) perdor te
      // NJEJTIN Page Access Token, jo token te vecante - Meta e ruteon vete
      // mesazhet Instagram te i njejti webhook i Faqes.
      instagram = await this.connectChannelUseCase.execute({
        businessId: input.businessId,
        channel: ChannelType.INSTAGRAM,
        externalAccountId: page.instagram_business_account.id,
        accessToken: page.access_token,
      });
    }

    return { messenger, instagram };
  }
}