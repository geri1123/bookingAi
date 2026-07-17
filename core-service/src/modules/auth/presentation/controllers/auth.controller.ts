import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { Public, CurrentUser, JwtPayload } from "@bookingai/auth";
import { LoginDto } from "../dto/login.dto";
import { SelectBusinessDto } from "../dto/select-business.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { SelectBusinessUseCase } from "../../application/use-cases/select-business.use-case";
import { RefreshTokenUseCase } from "../../application/use-cases/refresh-token.use-case";
import { LogoutUseCase } from "../../application/use-cases/logout.use-case";
import { CookieService } from "../../infrastructure/http/cookie.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly selectBusinessUseCase: SelectBusinessUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly cookieService: CookieService,
  ) {}

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Headers("x-client-type") clientType?: string,
  ) {
    const result = await this.loginUseCase.execute(dto);
    const rememberMe = dto.rememberMe ?? false;

    if (clientType === "mobile") {
      return {
        success: true,
        requiresBusinessSelection: result.requiresBusinessSelection,
        hasNoBusiness: result.hasNoBusiness,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        businesses: result.businesses,
      };
    }

    this.cookieService.setAuthCookies(res, result.tokens, rememberMe);
    return {
      success: true,
      requiresBusinessSelection: result.requiresBusinessSelection,
      hasNoBusiness: result.hasNoBusiness,
      businesses: result.businesses,
    };
  }

  @Post("select-business")
  @HttpCode(HttpStatus.OK)
  async selectBusiness(
    @Body() dto: SelectBusinessDto,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
    @Headers("x-client-type") clientType?: string,
  ) {
    const rememberMe = user.rememberMe ?? false;

    const tokens = await this.selectBusinessUseCase.execute({
      userId: user.sub,
      businessId: dto.businessId,
      rememberMe,
    });

    if (clientType === "mobile") {
      return { success: true, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }

    this.cookieService.setAuthCookies(res, tokens, rememberMe);
    return { success: true };
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Headers("x-client-type") clientType?: string,
  ) {
    const refreshToken = req.cookies?.refresh_token ?? dto.refreshToken;

    if (!refreshToken) {
      throw new BadRequestException("Refresh token mungon");
    }

    const result = await this.refreshTokenUseCase.execute(refreshToken);

    if (clientType === "mobile") {
      return { success: true, accessToken: result.tokens.accessToken, refreshToken: result.tokens.refreshToken };
    }

    this.cookieService.setAuthCookies(res, result.tokens, result.rememberMe);
    return { success: true };
  }

  @Public()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.logoutUseCase.execute();
    this.cookieService.clearAuthCookies(res);
    return { success: true };
  }
}