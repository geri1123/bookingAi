import { ChannelType } from "../entities/channel-type.enum";

export interface LogMessageParams {
  businessId: string;
  channel: ChannelType;
  externalId: string;
  content: string;
  providerId?: string;
}

export abstract class MessageLogRepository {
  abstract logInbound(params: LogMessageParams): Promise<void>;
  abstract logOutbound(params: LogMessageParams): Promise<void>;
}