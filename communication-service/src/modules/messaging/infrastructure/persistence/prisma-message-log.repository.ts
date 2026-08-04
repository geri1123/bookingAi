import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { LogMessageParams, MessageLogRepository } from "../../domain/repositories/message-log.repository";

@Injectable()
export class PrismaMessageLogRepository implements MessageLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async logInbound(params: LogMessageParams): Promise<void> {
    await this.write(params, "INBOUND");
  }

  async logOutbound(params: LogMessageParams): Promise<void> {
    await this.write(params, "OUTBOUND");
  }

  private async write(params: LogMessageParams, direction: "INBOUND" | "OUTBOUND"): Promise<void> {
    await this.prisma.message.create({
      data: {
        businessId: params.businessId,
        channel: params.channel,
        externalId: params.externalId,
        content: params.content,
        direction,
        providerId: params.providerId,
      },
    });
  }
}