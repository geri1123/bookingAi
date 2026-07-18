import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { InvitationCreateRepository } from "./domain/repositories/invitation-create.repository";
import { InvitationFindRepository } from "./domain/repositories/invitation-find.repository";
import { InvitationUpdateRepository } from "./domain/repositories/invitation-update.repository";
import { SendInvitationUseCase } from "./application/use-cases/send-invitation.use-case";
import { PrismaInvitationCreateRepository } from "./infrastucture/persistence/repositories/prisma-invitation-create.repository";
import { PrismaInvitationFindRepository } from "./infrastucture/persistence/repositories/prisma-invitation-find.repository";
import { InvitationsController } from "./presentation/controllers/invitation.controller";
import { PrismaInvitationUpdateRepository } from "./infrastucture/persistence/repositories/prisma-invitation-update.repository";

@Module({
  imports: [UsersModule],
  controllers: [InvitationsController],
  providers: [
    { provide: InvitationCreateRepository, useClass: PrismaInvitationCreateRepository },
    { provide: InvitationFindRepository, useClass: PrismaInvitationFindRepository },
    { provide: InvitationUpdateRepository, useClass: PrismaInvitationUpdateRepository },
    SendInvitationUseCase,
  ],
  exports: [InvitationFindRepository, InvitationUpdateRepository],
})
export class InvitationsModule {}