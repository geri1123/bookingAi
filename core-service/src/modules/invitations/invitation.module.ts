import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../users/users.module";
import { BusinessModule } from "../business/bussines.module";
import { InvitationCreateRepository } from "./domain/repositories/invitation-create.repository";
import { InvitationFindRepository } from "./domain/repositories/invitation-find.repository";
import { InvitationUpdateRepository } from "./domain/repositories/invitation-update.repository";
import { SendInvitationUseCase } from "./application/use-cases/send-invitation.use-case";
import { GetInvitationPreviewUseCase } from "./application/use-cases/get-invitation-preview.use-case";
import { AcceptInvitationRegisterUseCase } from "./application/use-cases/accept-invitation-register.use-case";
import { TokenService } from "../auth/domain/services/token.service";
import { JwtTokenService } from "../auth/infrastructure/security/jwt-token.service";
import { CookieService } from "../auth/infrastructure/http/cookie.service";
import { InvitationsController } from "./presentation/controllers/invitation.controller";
import { PrismaInvitationCreateRepository } from "./infrastucture/persistence/repositories/prisma-invitation-create.repository";
import { PrismaInvitationFindRepository } from "./infrastucture/persistence/repositories/prisma-invitation-find.repository";
import { PrismaInvitationUpdateRepository } from "./infrastucture/persistence/repositories/prisma-invitation-update.repository";
import { AcceptInvitationUseCase } from "./application/use-cases/accept-invitation.use-case";

@Module({
  imports: [
    UsersModule,
    BusinessModule,
    JwtModule.register({}),
  ],
  controllers: [InvitationsController],
  providers: [
    { provide: InvitationCreateRepository, useClass: PrismaInvitationCreateRepository },
    { provide: InvitationFindRepository, useClass: PrismaInvitationFindRepository },
    { provide: InvitationUpdateRepository, useClass: PrismaInvitationUpdateRepository },
    { provide: TokenService, useClass: JwtTokenService },
    CookieService,
    SendInvitationUseCase,
    GetInvitationPreviewUseCase,
    AcceptInvitationRegisterUseCase,
    AcceptInvitationUseCase,
  ],
  exports: [InvitationFindRepository, InvitationUpdateRepository],
})
export class InvitationsModule {}