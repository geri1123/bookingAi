import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { BusinessModule } from "../business/bussines.module";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { GoogleLoginUseCase } from "./application/use-cases/google-login.use-case";
import { SelectBusinessUseCase } from "./application/use-cases/select-business.use-case";
import { RefreshTokenUseCase } from "./application/use-cases/refresh-token.use-case";
import { LogoutUseCase } from "./application/use-cases/logout.use-case";
import { AuthenticateUserService } from "./application/services/authenticate-user.service";
import { AuthController } from "./presentation/controllers/auth.controller";
import { TokenService } from "./domain/services/token.service";
import { JwtTokenService } from "./infrastructure/security/jwt-token.service";
import { CookieService } from "./infrastructure/http/cookie.service";
import { GoogleAuthClient } from "./infrastructure/http/google-auth.client";

@Module({
  imports: [
    UsersModule,
    BusinessModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    GoogleLoginUseCase,
    SelectBusinessUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    AuthenticateUserService,
    GoogleAuthClient,
    { provide: TokenService, useClass: JwtTokenService },
    CookieService,
  ],
})
export class AuthModule {}