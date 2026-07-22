import { Module } from "@nestjs/common";
import { ResourceCreateRepository } from "./domain/repositories/resource-create.repository";
import { ResourceFindRepository } from "./domain/repositories/resource-find.repository";
import { ResourceUpdateRepository } from "./domain/repositories/resource-update.repository";
import { ResourceDeleteRepository } from "./domain/repositories/resource-delete.repository";
import { PrismaResourceCreateRepository } from "./infrastructure/persistence/repositories/prisma-resource-create.repository";
import { PrismaResourceFindRepository } from "./infrastructure/persistence/repositories/prisma-resource-find.repository";
import { PrismaResourceUpdateRepository } from "./infrastructure/persistence/repositories/prisma-resource-update.repository";
import { PrismaResourceDeleteRepository } from "./infrastructure/persistence/repositories/prisma-resource-delete.repository";
import { CreateResourceUseCase } from "./application/use-cases/create-resource.use-case";
import { ListResourcesUseCase } from "./application/use-cases/list-resources.use-case";
import { UpdateResourceUseCase } from "./application/use-cases/update-resource.use-case";
import { DeleteResourceUseCase } from "./application/use-cases/delete-resource.use-case";
import { ResourceController } from "./presentation/controllers/resource.controller";

@Module({
  controllers: [ResourceController],
  providers: [
    { provide: ResourceCreateRepository, useClass: PrismaResourceCreateRepository },
    { provide: ResourceFindRepository, useClass: PrismaResourceFindRepository },
    { provide: ResourceUpdateRepository, useClass: PrismaResourceUpdateRepository },
    { provide: ResourceDeleteRepository, useClass: PrismaResourceDeleteRepository },
    CreateResourceUseCase,
    ListResourcesUseCase,
    UpdateResourceUseCase,
    DeleteResourceUseCase,
  ],
  exports: [ResourceFindRepository],
})
export class ResourcesModule {}
