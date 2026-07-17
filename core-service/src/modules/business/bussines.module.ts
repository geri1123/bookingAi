import { Module } from "@nestjs/common";
import { BusinessMemberFindRepository } from "./domain/repositories/business-member-find.repository";
import { PrismaBusinessMemberFindRepository } from "./infrastructure/persistence/repositories/prisma-business-member-find.repository";

@Module({
  imports: [],
  controllers: [],
  providers: [
    { provide: BusinessMemberFindRepository, useClass: PrismaBusinessMemberFindRepository },
  ],
  exports: [BusinessMemberFindRepository],
})
export class BusinessModule {}