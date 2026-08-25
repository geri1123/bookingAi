import { Injectable } from "@nestjs/common";
import { MetaOAuthClient } from "../../infrastructure/http/meta-oauth.client";
import { ConnectBusinessChannelUseCase } from "./connect-business-channel.use-case";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";

export interface CompleteWhatsappEmbeddedSignupInput {
  businessId: string;
  code: string; 
  wabaId: string;
  phoneNumberId: string; 
}

@Injectable()
export class CompleteWhatsappEmbeddedSignupUseCase {
  constructor(
    private readonly metaOAuthClient: MetaOAuthClient,
    private readonly connectChannelUseCase: ConnectBusinessChannelUseCase,
  ) {}

  async execute(input: CompleteWhatsappEmbeddedSignupInput): Promise<{ id: string; channel: ChannelType }> {
   
    const accessToken = await this.metaOAuthClient.exchangeCodeForToken(input.code);

    
    await this.metaOAuthClient.subscribeAppToWaba(input.wabaId, accessToken);

  
    return this.connectChannelUseCase.execute({
      businessId: input.businessId,
      channel: ChannelType.WHATSAPP,
      externalAccountId: input.phoneNumberId,
      accessToken,
    });
  }
}
