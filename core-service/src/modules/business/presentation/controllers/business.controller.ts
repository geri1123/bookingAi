import { Body, Controller, HttpCode, HttpStatus, Post, Res, Headers, Patch, UseGuards, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { BusinessContextGuard, CurrentUser, JwtPayload, Roles } from "@bookingai/auth";
import { CreateBusinessDto } from "../dto/create-business.dto";
import { CreateBusinessUseCase } from "../../application/use-cases/create-business.use-case";
import { CookieService } from "../../../auth/infrastructure/http/cookie.service";
import { UpdateBusinessLocationDto } from "../dto/update-business-location.dto";
import { UploadedFileLike } from "../../../../infrastructure/cloudinary/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateBusinessProfileImageUseCase } from "../../application/use-cases/update-bussines-profile-image.use-case";
import { UpdateBusinessLocationUseCase } from "../../application/use-cases/update-business-location.use-case";

@Controller("business")
export class BusinessController {
  constructor(
    private readonly createBusinessUseCase: CreateBusinessUseCase,
    private readonly updateProfileImageUseCase: UpdateBusinessProfileImageUseCase,
    private readonly updateLocationUseCase: UpdateBusinessLocationUseCase,
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
  @UseGuards(BusinessContextGuard)
  @Roles("OWNER", "MANAGER")
  @Post("profile-image")
  @UseInterceptors(FileInterceptor("image", { limits: { fileSize: 5 * 1024 * 1024 } }))
  async uploadProfileImage(@UploadedFile() file: UploadedFileLike, @CurrentUser() user: JwtPayload) {
    const result = await this.updateProfileImageUseCase.execute({
      businessId: user.businessId!,
      file,
    });
    return { success: true, profileImageUrl: result.profileImageUrl };
  }

  @UseGuards(BusinessContextGuard)
  @Roles("OWNER", "MANAGER")
  @Patch("location")
  async updateLocation(@Body() dto: UpdateBusinessLocationDto, @CurrentUser() user: JwtPayload) {
    await this.updateLocationUseCase.execute({
      businessId: user.businessId!,
      latitude: dto.latitude,
      longitude: dto.longitude,
    });
    return { success: true };
  }
}