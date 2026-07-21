import { Module } from "@nestjs/common";
import { ServiceCreateRepository } from "./domain/repositories/service-create.repository";
import { ServiceFindRepository } from "./domain/repositories/service-find.repository";
import { ServiceUpdateRepository } from "./domain/repositories/service-update.repository";
import { ServiceDeleteRepository } from "./domain/repositories/service-delete.repository";
import { PrismaServiceCreateRepository } from "./infrastructure/persistence/repositories/prisma-service-create.repository";
import { PrismaServiceFindRepository } from "./infrastructure/persistence/repositories/prisma-service-find.repository";
import { PrismaServiceUpdateRepository } from "./infrastructure/persistence/repositories/prisma-service-update.repository";
import { PrismaServiceDeleteRepository } from "./infrastructure/persistence/repositories/prisma-service-delete.repository";
import { CreateServiceUseCase } from "./application/use-cases/create-service.use-case";
import { ListServicesUseCase } from "./application/use-cases/list-services.use-case";
import { UpdateServiceUseCase } from "./application/use-cases/update-service.use-case";
import { DeleteServiceUseCase } from "./application/use-cases/delete-service.use-case";
import { ServiceController } from "./presentation/controllers/service.controller";

@Module({
  controllers: [ServiceController ],
  providers: [
    { provide: ServiceCreateRepository, useClass: PrismaServiceCreateRepository },
    { provide: ServiceFindRepository, useClass: PrismaServiceFindRepository },
    { provide: ServiceUpdateRepository, useClass: PrismaServiceUpdateRepository },
    { provide: ServiceDeleteRepository, useClass: PrismaServiceDeleteRepository },
    CreateServiceUseCase,
    ListServicesUseCase,
    UpdateServiceUseCase,
    DeleteServiceUseCase,
  ],
  exports: [ServiceFindRepository], 
})
export class ServicesModule {}