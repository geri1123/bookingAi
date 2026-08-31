import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { BusinessMemberFindRepository } from "./domain/repositories/business-member-find.repository";
import { PrismaBusinessMemberFindRepository } from "./infrastructure/persistence/repositories/prisma-business-member-find.repository";
import { BusinessCreateRepository } from "./domain/repositories/business-create.repository";
import { PrismaBusinessCreateRepository } from "./infrastructure/persistence/repositories/prisma-business-create.repository";
import { BusinessMemberCreateRepository } from "./domain/repositories/business-member-create.repository";
import { PrismaBusinessMemberCreateRepository } from "./infrastructure/persistence/repositories/prisma-business-member-create.repository";
import { BusinessFindRepository } from "./domain/repositories/business-find.repository";
import { PrismaBusinessFindRepository } from "./infrastructure/persistence/repositories/prisma-business-find.repository";
import { BusinessUpdateRepository } from "./domain/repositories/business-update.repositoy";
import { PrismaBusinessUpdateRepository } from "./infrastructure/persistence/repositories/prisma-business-update.repository";
import { CreateBusinessUseCase } from "./application/use-cases/create-business.use-case";
import { BusinessController } from "./presentation/controllers/business.controller";
import { TokenService } from "../auth/domain/services/token.service";
import { JwtTokenService } from "../auth/infrastructure/security/jwt-token.service";
import { CookieService } from "../auth/infrastructure/http/cookie.service";
import { UsersModule } from "../users/users.module";
import { UpdateBusinessProfileImageUseCase } from "./application/use-cases/update-bussines-profile-image.use-case";
import { UpdateBusinessLocationUseCase } from "./application/use-cases/update-business-location.use-case";
import { PublicBusinessController } from "./presentation/controllers/public-business.controller";
import { BusinessCacheService } from "./infrastructure/persistence/cache/business-cache.service";
import { InternalBusinessController } from "./presentation/controllers/internal-business.controller";
import { GetBusinessMe } from "./application/use-cases/get-business-me.use-case";

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [BusinessController , PublicBusinessController, InternalBusinessController],
  providers: [
    { provide: BusinessMemberFindRepository, useClass: PrismaBusinessMemberFindRepository },
    { provide: BusinessCreateRepository, useClass: PrismaBusinessCreateRepository },
    { provide: BusinessMemberCreateRepository, useClass: PrismaBusinessMemberCreateRepository },
    { provide: BusinessFindRepository, useClass: PrismaBusinessFindRepository },
    { provide: BusinessUpdateRepository, useClass: PrismaBusinessUpdateRepository },
    { provide: TokenService, useClass: JwtTokenService },
    CookieService,
    BusinessCacheService,
    CreateBusinessUseCase,
    UpdateBusinessProfileImageUseCase,
    UpdateBusinessLocationUseCase,
    GetBusinessMe,
    InternalBusinessController
  ],
  exports: [
    BusinessMemberFindRepository,
    BusinessFindRepository,
    BusinessMemberCreateRepository,
    BusinessUpdateRepository,
    BusinessCacheService
  ],
})
export class BusinessModule {}