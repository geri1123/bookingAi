import { Injectable, Logger } from "@nestjs/common";
import { CoreServiceClient } from "../infrastructure/http/core-service.client";
import { AiServiceClient } from "../infrastructure/http/ai-service.client";
import { MetaMessagingClient } from "../infrastructure/http/meta-messaging.client";
import { MessageLogRepository } from "../domain/repositories/message-log.repository";
import { ChannelType } from "../domain/entities/channel-type.enum";

export interface HandleInboundMessageInput {
  channel: ChannelType;
  receivingAccountId: string;
  senderExternalId: string;
  text: string;
  providerId?: string;
}

@Injectable()
export class HandleInboundMessageUseCase {
  private readonly logger = new Logger(HandleInboundMessageUseCase.name);

  constructor(
    private readonly coreServiceClient: CoreServiceClient,
    private readonly aiServiceClient: AiServiceClient,
    private readonly metaMessagingClient: MetaMessagingClient,
    private readonly messageLogRepo: MessageLogRepository,
  ) {}

  async execute(input: HandleInboundMessageInput): Promise<void> {
    const lookup = await this.coreServiceClient.lookupChannel(input.channel, input.receivingAccountId);
    if (!lookup) {
      this.logger.warn(`S'u gjet lidhje per ${input.channel}/${input.receivingAccountId} - injorohet.`);
      return;
    }

    await this.messageLogRepo.logInbound({
      businessId: lookup.businessId,
      channel: input.channel,
      externalId: input.senderExternalId,
      content: input.text,
      providerId: input.providerId,
    });

    if (!lookup.isActive || !lookup.aiEnabled || !lookup.businessIsActive) return;

    let replyText: string;
    try {
      replyText = await this.aiServiceClient.handleIncomingMessage({
        businessId: lookup.businessId,
        customerExternalId: input.senderExternalId,
        channel: input.channel,
        text: input.text,
      });
    } catch (err) {
      this.logger.error(`ai-service deshtoi per biznesin ${lookup.businessId}: ${err instanceof Error ? err.message : err}`);
      throw err;
    }

    if (!replyText || !lookup.accessToken) return;

    try {
      await this.metaMessagingClient.sendMessage({
        channel: input.channel,
        senderAccountId: input.receivingAccountId,
        recipientExternalId: input.senderExternalId,
        text: replyText,
        accessToken: lookup.accessToken,
      });

      await this.messageLogRepo.logOutbound({
        businessId: lookup.businessId,
        channel: input.channel,
        externalId: input.senderExternalId,
        content: replyText,
      });
    } catch (err) {
      this.logger.error(`Dergimi i pergjigjes deshtoi per biznesin ${lookup.businessId}: ${err instanceof Error ? err.message : err}`);
      throw err;
    }
  }
}