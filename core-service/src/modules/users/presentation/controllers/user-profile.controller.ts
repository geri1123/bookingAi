import { Body, Controller, HttpCode, HttpStatus, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtAuthGuard, JwtPayload } from "@bookingai/auth";
import { UpdateProfileDto } from "../dto/update-profile.dto";
import { UpdateProfileUseCase } from "../../application/use-cases/update-profile.use-case";

@Controller("users")
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {}

  @Patch("me")
  @HttpCode(HttpStatus.OK)
  async updateProfile(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    const updated = await this.updateProfileUseCase.execute({ userId: user.sub, ...dto });
    return { success: true, user: updated.toPersistence() };
  }
}