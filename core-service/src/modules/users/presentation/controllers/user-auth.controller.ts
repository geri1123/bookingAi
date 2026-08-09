import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { RegisterUserDto } from "../dto/register-user.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { VerifyEmailDto } from "../dto/verify-email.dto";
import { VerifyEmailUseCase } from "../../application/use-cases/verify-email.use-case";
import { Public } from "@bookingai/auth";
import { ResendVerificationDto } from "../dto/resend-verification.dto";
import { ResendVerificationUseCase } from "../../application/use-cases/resend-verification.use-case";
import { RequestPasswordResetUseCase } from "../../application/use-cases/request-password-reset.use-case";
import {  RequestPasswordResetDto } from "../dto/request-password-reset.dto";
import { UserMessageCode } from "../../domain/messages/user-message-codes.enum";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { ResetPasswordUseCase } from "../../application/use-cases/reset-password.use-case";

@Controller("auth")
export class UserAuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase:VerifyEmailUseCase,
    private readonly resendVerificationUseCase:ResendVerificationUseCase,
    private readonly requestPasswordResetUseCase:RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase:ResetPasswordUseCase
  ) {}
  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
       return { success: true, userId: user.id, code: UserMessageCode.REGISTERED };
  }
  @Public()
 @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.verifyEmailUseCase.execute(dto);
      return { success: true, code: UserMessageCode.EMAIL_VERIFIED };
  }
   @Public()
  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.resendVerificationUseCase.execute(dto);
    return { success: true, code: UserMessageCode.VERIFICATION_EMAIL_SENT_IF_EXISTS };
  }

  @Public()
  @Post("request-password-reset")
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(@Body() dto:RequestPasswordResetDto) {
    await this.requestPasswordResetUseCase.execute({ email: dto.email });
    return { success: true, code: UserMessageCode.PASSWORD_RESET_SENT_IF_EXISTS };
  }
   @Public()
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(dto);
    return { success: true, code: UserMessageCode.PASSWORD_RESET_SUCCESS };
  }
}