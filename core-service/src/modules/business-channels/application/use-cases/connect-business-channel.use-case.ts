import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { BusinessChannelConnectionFindRepository } from "../../domain/repositories/business-channel-connection-find.repository";
import { BusinessChannelConnectionWriteRepository } from "../../domain/repositories/business-channel-connection-write.repository";
import { ChannelTokenEncryptor } from "../../domain/services/channel-token-encryptor";
import { BusinessChannelConnectionEntity, ChannelType } from "../../domain/entities/business-channel-connection.entity";
import { BusinessChannelErrorCode } from "../../domain/errors/business-channel-error-codes.enum";

export interface ConnectBusinessChannelInput {
  businessId: string;
  channel: ChannelType;
  externalAccountId: string; // phone_number_id / page_id / ig_business_account_id
  accessToken: string; // plain - enkriptohet ketu para se te ruhet
}

@Injectable()
export class ConnectBusinessChannelUseCase {
  constructor(
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly channelFindRepo: BusinessChannelConnectionFindRepository,
    private readonly channelWriteRepo: BusinessChannelConnectionWriteRepository,
    private readonly tokenEncryptor: ChannelTokenEncryptor,
  ) {}

  async execute(input: ConnectBusinessChannelInput): Promise<{ id: string; channel: ChannelType }> {
    const business = await this.businessFindRepo.findById(input.businessId);
    if (!business) {
      throw new AppException(BusinessChannelErrorCode.BUSINESS_NOT_FOUND, {}, HttpStatus.NOT_FOUND);
    }

    // Ky phone_number_id/page_id/ig_id mund te jete tashme i lidhur me nje biznes tjeter
    // (p.sh. dikush provon te fusi te njejtin numer WhatsApp dy here) - kjo e ndalon.
    const existingForAccount = await this.channelFindRepo.findByChannelAndExternalAccountId(
      input.channel,
      input.externalAccountId,
    );
    if (existingForAccount && existingForAccount.businessId !== input.businessId) {
      throw new AppException(
        BusinessChannelErrorCode.ALREADY_CONNECTED_TO_ANOTHER_BUSINESS,
        { field: "externalAccountId" },
        HttpStatus.CONFLICT,
      );
    }

    const accessTokenEncrypted = this.tokenEncryptor.encrypt(input.accessToken);

    const existingForBusiness = await this.channelFindRepo.findByBusinessAndChannel(
      input.businessId,
      input.channel,
    );

    if (existingForBusiness) {
      existingForBusiness.reconnect(input.externalAccountId, accessTokenEncrypted);
      const saved = await this.channelWriteRepo.update(existingForBusiness);
      return { id: saved.id, channel: saved.channel };
    }

    const connection = BusinessChannelConnectionEntity.create({
      businessId: input.businessId,
      channel: input.channel,
      externalAccountId: input.externalAccountId,
      accessTokenEncrypted,
    });
    const saved = await this.channelWriteRepo.create(connection);
    return { id: saved.id, channel: saved.channel };
  }
}
