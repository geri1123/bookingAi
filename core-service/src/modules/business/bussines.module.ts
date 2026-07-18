import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BusinessMemberFindRepository } from "./domain/repositories/business-member-find.repository";
import { PrismaBusinessMemberFindRepository } from "./infrastructure/persistence/repositories/prisma-business-member-find.repository";
import { BusinessCreateRepository } from "./domain/repositories/business-create.repository";
import { PrismaBusinessCreateRepository } from "./infrastructure/persistence/repositories/prisma-business-create.repository";
import { BusinessMemberCreateRepository } from "./domain/repositories/business-member-create.repository";
import { PrismaBusinessMemberCreateRepository } from "./infrastructure/persistence/repositories/prisma-business-member-create.repository";
import { CreateBusinessUseCase } from "./application/use-cases/create-business.use-case";
import { BusinessController } from "./presentation/controllers/business.controller";
import { TokenService } from "../auth/domain/services/token.service";
import { JwtTokenService } from "../auth/infrastructure/security/jwt-token.service";
import { CookieService } from "../auth/infrastructure/http/cookie.service";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [BusinessController],
  providers: [
    { provide: BusinessMemberFindRepository, useClass: PrismaBusinessMemberFindRepository },
    { provide: BusinessCreateRepository, useClass: PrismaBusinessCreateRepository },
    { provide: BusinessMemberCreateRepository, useClass: PrismaBusinessMemberCreateRepository },
    { provide: TokenService, useClass: JwtTokenService },
    CookieService,
    CreateBusinessUseCase,
  ],
  exports: [BusinessMemberFindRepository],
})
export class BusinessModule {}