import { BusinessChannelConnectionEntity, ChannelType } from "../entities/business-channel-connection.entity";

export abstract class BusinessChannelConnectionFindRepository {
  abstract findByBusinessAndChannel(
    businessId: string,
    channel: ChannelType,
  ): Promise<BusinessChannelConnectionEntity | null>;

  abstract findAllByBusiness(businessId: string): Promise<BusinessChannelConnectionEntity[]>;

  // Perdoret nga webhook-et: mesazhi hyres sjell phone_number_id/page_id/ig_id,
  // jo businessId - kjo eshte pika qe e "gjen" biznesin.
  abstract findByChannelAndExternalAccountId(
    channel: ChannelType,
    externalAccountId: string,
  ): Promise<BusinessChannelConnectionEntity | null>;
}
