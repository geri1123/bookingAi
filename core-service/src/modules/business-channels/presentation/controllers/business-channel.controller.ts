import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseEnumPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { BusinessContextGuard, CurrentUser, JwtPayload, Roles } from "@bookingai/auth";
import { ConnectBusinessChannelUseCase } from "../../application/use-cases/connect-business-channel.use-case";
import { DisconnectBusinessChannelUseCase } from "../../application/use-cases/disconnect-business-channel.use-case";
import { ToggleChannelAiUseCase } from "../../application/use-cases/toggle-channel-ai.use-case";
import { ListBusinessChannelsUseCase } from "../../application/use-cases/list-business-channels.use-case";
import { CompleteWhatsappEmbeddedSignupUseCase } from "../../application/use-cases/complete-whatsapp-embedded-signup.use-case";
import { CompleteMetaLoginUseCase } from "../../application/use-cases/complete-meta-login.use-case";
import {
  ConnectBusinessChannelDto,
  ToggleChannelAiDto,
  CompleteWhatsappEmbeddedSignupDto,
  CompleteMetaLoginDto,
} from "../dto/connect-business-channel.dto";
import { ChannelType } from "../../domain/entities/business-channel-connection.entity";

@UseGuards(BusinessContextGuard)
@Roles("OWNER", "MANAGER")
@Controller("business/channels")
export class BusinessChannelController {
  constructor(
    private readonly connectUseCase: ConnectBusinessChannelUseCase,
    private readonly disconnectUseCase: DisconnectBusinessChannelUseCase,
    private readonly toggleAiUseCase: ToggleChannelAiUseCase,
    private readonly listUseCase: ListBusinessChannelsUseCase,
    private readonly completeEmbeddedSignupUseCase: CompleteWhatsappEmbeddedSignupUseCase,
    private readonly completeMetaLoginUseCase: CompleteMetaLoginUseCase,
  ) {}

  // Statusi i te 3 kanaleve (WhatsApp/Messenger/Instagram) per dashboard-in e biznesit.
  // S'kthen kurre access token-in.
  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const channels = await this.listUseCase.execute(user.businessId!);
    return { success: true, channels };
  }

  // MVP: lidhje manuale - pronari ngjit externalAccountId + access token te marra nga Meta.
  @Post(":channel/connect")
  @HttpCode(HttpStatus.OK)
  async connect(
    @Param("channel", new ParseEnumPipe(ChannelType)) channel: ChannelType,
    @Body() dto: ConnectBusinessChannelDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.connectUseCase.execute({
      businessId: user.businessId!,
      channel,
      externalAccountId: dto.externalAccountId,
      accessToken: dto.accessToken,
    });
    return { success: true, ...result };
  }

  // Lidhje automatike WhatsApp permes Embedded Signup: frontend-i hap popup-in
  // e Meta JS SDK, merr "code" (nga callback-u i SDK-se) + "wabaId"/"phoneNumberId"
  // (nga eventi postMessage WA_EMBEDDED_SIGNUP), dhe i dergon ketu.
  @Post("whatsapp/embedded-signup/complete")
  @HttpCode(HttpStatus.OK)
  async completeWhatsappEmbeddedSignup(
    @Body() dto: CompleteWhatsappEmbeddedSignupDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const result = await this.completeEmbeddedSignupUseCase.execute({
      businessId: user.businessId!,
      code: dto.code,
      wabaId: dto.wabaId,
      phoneNumberId: dto.phoneNumberId,
    });
    return { success: true, ...result };
  }

  // Lidhje automatike Messenger + Instagram (1 popup Facebook Login for
  // Business): frontend-i therret FB.login() me response_type: 'code' dhe
  // dergon "code" ketu. Backend-i gjen Faqen (Page) e autorizuar, e lidh per
  // Messenger, dhe nese ka Instagram te lidhur me ate Faqe, e lidh edhe ate.
  @Post("meta/login/complete")
  @HttpCode(HttpStatus.OK)
  async completeMetaLogin(@Body() dto: CompleteMetaLoginDto, @CurrentUser() user: JwtPayload) {
    const result = await this.completeMetaLoginUseCase.execute({
      businessId: user.businessId!,
      code: dto.code,
    });
    return { success: true, ...result };
  }

  @Delete(":channel")
  @HttpCode(HttpStatus.OK)
  async disconnect(
    @Param("channel", new ParseEnumPipe(ChannelType)) channel: ChannelType,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.disconnectUseCase.execute({ businessId: user.businessId!, channel });
    return { success: true };
  }

  @Patch(":channel/ai-enabled")
  @HttpCode(HttpStatus.OK)
  async toggleAi(
    @Param("channel", new ParseEnumPipe(ChannelType)) channel: ChannelType,
    @Body() dto: ToggleChannelAiDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.toggleAiUseCase.execute({ businessId: user.businessId!, channel, aiEnabled: dto.aiEnabled });
    return { success: true };
  }
}
