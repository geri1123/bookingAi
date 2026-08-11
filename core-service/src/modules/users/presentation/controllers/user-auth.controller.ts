import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { RegisterUserDto } from "../dto/register-user.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { VerifyEmailDto } from "../dto/verify-email.dto";
import { VerifyEmailUseCase } from "../../application/use-cases/verify-email.use-case";
import { Public } from "@bookingai/auth";
import { ResendVerificationDto } from "../dto/resend-verification.dto";
import { ResendVerificationUseCase } from "../../application/use-cases/resend-verification.use-case";
import { RequestPasswordResetDto } from "../dto/request-password-reset.dto";
import { RequestPasswordResetUseCase } from "../../application/use-cases/request-password-reset.use-case";
import { ResetPasswordDto } from "../dto/reset-password.dto";
import { ResetPasswordUseCase } from "../../application/use-cases/reset-password.use-case";
import { UserMessageCode } from "../../domain/messages/user-message-codes.enum";
import { RateLimit } from "../../../../infrastructure/rate-limit/rate-limit.decorator";
import { RateLimitGuard } from "../../../../infrastructure/rate-limit/rate-limit.guard";

@Controller("auth")
export class UserAuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase:VerifyEmailUseCase,
    private readonly resendVerificationUseCase:ResendVerificationUseCase,
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}
  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit("register", 5, 600_000) // default: 5/10min per IP; override me RATE_LIMIT_REGISTER_MAX / RATE_LIMIT_REGISTER_WINDOW_MS
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
  @UseGuards(RateLimitGuard)
  @RateLimit("resend-verification", 3, 900_000) // default: 3/15min per IP — kunder "email bombing"
  @Post("resend-verification")
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.resendVerificationUseCase.execute(dto);
    return { success: true, code: UserMessageCode.VERIFICATION_EMAIL_SENT_IF_EXISTS };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit("forgot-password", 3, 900_000) // default: 3/15min per IP — kunder "email bombing" + enumeration
  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: RequestPasswordResetDto) {
    await this.requestPasswordResetUseCase.execute(dto);
    return { success: true, code: UserMessageCode.PASSWORD_RESET_SENT_IF_EXISTS };
  }

  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit("reset-password", 5, 900_000) // default: 5/15min per IP
  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(dto);
    return { success: true, code: UserMessageCode.PASSWORD_RESET_SUCCESS };
  }

}