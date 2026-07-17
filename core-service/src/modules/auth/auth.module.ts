import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { BusinessModule } from "../business/bussines.module";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { SelectBusinessUseCase } from "./application/use-cases/select-business.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { LogoutUseCase } from "./application/use-cases/logout.use-case";
import { AuthController } from "./presentation/controllers/auth.controller";
import { TokenService } from "./domain/services/token.service";
import { JwtTokenService } from "./infrastructure/security/jwt-token.service";
import { CookieService } from "./infrastructure/http/cookie.service";

@Module({
  imports: [
    UsersModule,
    BusinessModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    SelectBusinessUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    { provide: TokenService, useClass: JwtTokenService },
    CookieService,
  ],
})
export class AuthModule {}