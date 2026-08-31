import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtAuthGuard, JwtPayload } from "@bookingai/auth";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateProfileUseCase } from "../../application/use-cases/update-profile.use-case";
import { UserMapper } from "../../infrastructure/persistence/mappers/user.mapper";
import { GetUserMeUseCase } from "../../application/use-cases/get-user-me.use-case";
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(
    private readonly updateprofile: UpdateProfileUseCase,
    private readonly getUserMeUseCase:GetUserMeUseCase
  ) {}

  @Patch("me")
  @HttpCode(HttpStatus.OK)
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    const updated = await this.updateprofile.execute({ userId: user.sub, ...dto });
    return { success: true, user: UserMapper.toResponse(updated) };
  }


 @Get("me")
async getContext(@CurrentUser() user: JwtPayload) {
  return this.getUserMeUseCase.execute(user.sub)
}
}