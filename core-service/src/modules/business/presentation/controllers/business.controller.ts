import { Body, Controller, HttpCode, HttpStatus, Post, Res, Headers } from "@nestjs/common";
import { Response } from "express";
import { CurrentUser, JwtPayload } from "@bookingai/auth";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { CreateBusinessUseCase } from "../../application/use-cases/create-business.use-case";
import { CookieService } from "../../../auth/infrastructure/http/cookie.service";

@Controller("business")
export class BusinessController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly cookieService: CookieService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateBusinessDto,
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
    @Headers("x-client-type") clientType?: string,
  ) {
    const rememberMe = user.rememberMe ?? false;

    const result = await this.createBusinessUseCase.execute({
      userId: user.sub,
      rememberMe,
      name: dto.name,
      type: dto.type,
      language: dto.language,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
    });

    const shouldAutoLogin = user.type === "pre-auth";

    if (!shouldAutoLogin) {
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