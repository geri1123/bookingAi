import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { RegisterUserDto } from "../dto/register-user.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";
import { VerifyEmailDto } from "../dto/verify-email.dto";
import { VerifyEmailUseCase } from "../../application/use-cases/verify-email.use-case";

@Controller("auth")
export class UserAuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly verifyEmailUseCase:VerifyEmailUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return { success: true, userId: user.id };
  }

 @Post("verify-email")
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    await this.verifyEmailUseCase.execute(dto);
    return { success: true };
  }

}