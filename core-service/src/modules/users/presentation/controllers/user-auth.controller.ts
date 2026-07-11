import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from "@nestjs/common";
import { RegisterUserDto } from "../dto/register-user.dto";
import { RegisterUserUseCase } from "../../application/use-cases/register-user.use-case";

@Controller("auth")
export class UserAuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return { success: true, userId: user.id };
  }


}