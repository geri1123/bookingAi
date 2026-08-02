import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessChannelConnectionFindRepository } from "../../domain/repositories/business-channel-connection-find.repository";
import { BusinessChannelConnectionWriteRepository } from "../../domain/repositories/business-channel-connection-write.repository";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";
import { BusinessChannelErrorCode } from "../../domain/errors/business-channel-error-codes.enum";

export interface DisconnectBusinessChannelInput {
  businessId: string;
  channel: ChannelType;
}

@Injectable()
export class DisconnectBusinessChannelUseCase {
  constructor(
    private readonly channelFindRepo: BusinessChannelConnectionFindRepository,
    private readonly channelWriteRepo: BusinessChannelConnectionWriteRepository,
  ) {}

  async execute(input: DisconnectBusinessChannelInput): Promise<void> {
    const connection = await this.channelFindRepo.findByBusinessAndChannel(input.businessId, input.channel);
    if (!connection) {
      throw new AppException(BusinessChannelErrorCode.NOT_FOUND, {}, HttpStatus.NOT_FOUND);
    }

    connection.disconnect();
    await this.channelWriteRepo.update(connection);
  }
}
