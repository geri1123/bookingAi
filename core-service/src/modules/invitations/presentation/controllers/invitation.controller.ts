import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { CurrentUser, JwtPayload, Roles, BusinessContextGuard, Public } from "@bookingai/auth";
import { SendInvitationDto } from "../dto/send-invitation.dto";
import { AcceptInvitationRegisterDto } from "../dto/accept-invitation-register.dto";
import { SendInvitationUseCase } from "../../application/use-cases/send-invitation.use-case";
import { GetInvitationPreviewUseCase } from "../../application/use-cases/get-invitation-preview.use-case";
import { AcceptInvitationRegisterUseCase } from "../../application/use-cases/accept-invitation-register.use-case";
import { AcceptInvitationUseCase } from "../../application/use-cases/accept-invitation.use-case";
import { CookieService } from "../../../auth/infrastructure/http/cookie.service";

@Controller("invitations")
export class InvitationsController {
  constructor(
    private readonly sendInvitationUseCase: SendInvitationUseCase,
    private readonly getInvitationPreviewUseCase: GetInvitationPreviewUseCase,
    private readonly acceptInvitationRegisterUseCase: AcceptInvitationRegisterUseCase,
    private readonly acceptInvitationUseCase: AcceptInvitationUseCase,
    private readonly cookieService: CookieService,
  ) {}

  @Roles("OWNER", "MANAGER")
  @UseGuards(BusinessContextGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async send(@Body() dto: SendInvitationDto, @CurrentUser() user: JwtPayload) {
    if (!user.businessId) {
      throw new Error("businessId mungon nga tokeni");
    }

    const result = await this.sendInvitationUseCase.execute({
      businessId: user.businessId,
      invitedBy: user.sub,
      email: dto.email,
      role: dto.role,
    });

    return { success: true, invitationId: result.invitationId };
  }

  @Public()
  @Get(":token")
  @HttpCode(HttpStatus.OK)
  async preview(@Param("token") token: string) {
    return this.getInvitationPreviewUseCase.execute(token);
  }

  @Public()
  @Post(":token/register")
  @HttpCode(HttpStatus.CREATED)
  async acceptAndRegister(
    @Param("token") token: string,
    @Body() dto: AcceptInvitationRegisterDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("x-client-type") clientType?: string,
  ) {
    const tokens = await this.acceptInvitationRegisterUseCase.execute({ token, ...dto });

    if (clientType === "mobile") {
      return { success: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }

    this.cookieService.setAuthCookies(res, tokens, false);
    return { success: true };
  }

  @Post(":token/accept")
  @HttpCode(HttpStatus.OK)
  async accept(
    @Param("token") token: string,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
    @Headers("x-client-type") clientType?: string,
  ) {
    const rememberMe = user.rememberMe ?? false;
    const isPreAuth = user.type === "pre-auth";

    const result = await this.acceptInvitationUseCase.execute({
      token,
      userId: user.sub,
      rememberMe,
      isPreAuth,
    });

    if (!result.autoSwitched || !result.tokens) {
      return { success: true, businessId: result.businessId };
    }

    if (clientType === "mobile") {
      return {
        success: true,
        businessId: result.businessId,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      };
    }

    this.cookieService.setAuthCookies(res, result.tokens, rememberMe);
    return { success: true, businessId: result.businessId };
  }
}