import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { RegisterUserDto } from "../dto/register-user.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { VerifyEmailDto } from "../dto/verify-email.dto";
import { VerifyEmailUseCase } from "../../application/use-cases/verify-email.use-case";
import { Public } from "@bookingai/auth";
import { ResendVerificationDto } from "../dto/resend-verification.dto";
import { ResendVerificationUseCase } from "../../application/use-cases/resend-verification.use-case";

@Controller("auth")
export class UserAuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase:VerifyEmailUseCase,
    private readonly resendVerificationUseCase:ResendVerificationUseCase,
  ) {}
  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return { success: true, userId: user.id };
  }
  @Public()
 @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.verifyEmailUseCase.execute(dto);
    return { success: true };
  }
   @Public()
  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.resendVerificationUseCase.execute(dto);
    return { success: true, message: "Nese email-i ekziston dhe s'eshte verifikuar, u dergua token i ri." };
  }

}