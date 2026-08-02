import { IsEnum, IsString, IsUUID, MinLength } from "class-validator";
import { CommunicationChannel } from "../../domain/repositories/conversation.repository";

export class HandleMessageDto {
  @IsUUID()
  businessId!: string;

  @IsString()
  @MinLength(1)
  customerExternalId!: string; 

  @IsEnum(CommunicationChannel)
  channel!: CommunicationChannel;

  @IsString()
  @MinLength(1)
  text!: string;
}