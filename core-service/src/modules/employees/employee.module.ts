import { Module } from "@nestjs/common";
import { EmployeeCreateRepository } from "./domain/repositories/employee-create.repository";
import { EmployeeFindRepository } from "./domain/repositories/employee-find.repository";
import { EmployeeUpdateRepository } from "./domain/repositories/employee-update.repository";
import { EmployeeDeleteRepository } from "./domain/repositories/employee-delete.repository";
import { PrismaEmployeeCreateRepository } from "./infrastructure/persistence/repositories/prisma-employee-create.repository";
import { PrismaEmployeeFindRepository } from "./infrastructure/persistence/repositories/prisma-employee-find.repository";
import { PrismaEmployeeUpdateRepository } from "./infrastructure/persistence/repositories/prisma-employee-update.repository";
import { PrismaEmployeeDeleteRepository } from "./infrastructure/persistence/repositories/prisma-employee-delete.repository";
import { CreateEmployeeUseCase } from "./application/use-cases/create-employee.use-case";
import { ListEmployeesUseCase } from "./application/use-cases/list-employees.use-case";
import { UpdateEmployeeUseCase } from "./application/use-cases/update-employee.use-case";
import { DeleteEmployeeUseCase } from "./application/use-cases/delete-employee.use-case";
import { EmployeeController } from "./presentation/controllers/employee.controller";

@Module({
  controllers: [EmployeeController],
  providers: [
    { provide: EmployeeCreateRepository, useClass: PrismaEmployeeCreateRepository },
    { provide: EmployeeFindRepository, useClass: PrismaEmployeeFindRepository },
    { provide: EmployeeUpdateRepository, useClass: PrismaEmployeeUpdateRepository },
    { provide: EmployeeDeleteRepository, useClass: PrismaEmployeeDeleteRepository },
    CreateEmployeeUseCase,
    ListEmployeesUseCase,
    UpdateEmployeeUseCase,
    DeleteEmployeeUseCase,
  ],
  exports: [EmployeeFindRepository],
})
export class EmployeesModule {}
