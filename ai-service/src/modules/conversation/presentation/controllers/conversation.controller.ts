import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { HandleMessageDto } from "../dto/handle-message.dto";
import { HandleIncomingMessageUseCase } from "../../application/handle-incoming-message.use-case";
import { InternalApiKeyGuard } from "../../../../common/guards/internal-api-key.guard";

// Endpoint INTERN — thirret vetem nga communication-service.
// Mbrohet me InternalApiKeyGuard (shared secret); network isolation
// mbetet shtresa e dyte e mbrojtjes ne prodhim.
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
