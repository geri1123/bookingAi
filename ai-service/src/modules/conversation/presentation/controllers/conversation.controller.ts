import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { Public } from "@bookingai/auth"; // ← shtuar
import { HandleMessageDto } from "../dto/handle-message.dto";
import { HandleIncomingMessageUseCase } from "../../application/handle-incoming-message.use-case";
import { InternalApiKeyGuard } from "../../../../common/guards/internal-api-key.guard";

@Public() 
@UseGuards(InternalApiKeyGuard) 
@Controller("internal/conversations")
export class ConversationController {
  constructor(private readonly handleIncomingMessage: HandleIncomingMessageUseCase) {}

  @Post("handle-message")
  @HttpCode(HttpStatus.OK)
  async handleMessage(@Body() dto: HandleMessageDto) {
    return this.handleIncomingMessage.execute(dto);
  }
}