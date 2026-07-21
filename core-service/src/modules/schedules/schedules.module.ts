import { Module } from "@nestjs/common";
import { ScheduleCreateRepository } from "./domain/repositories/schedule-create.repository";
import { ScheduleFindRepository } from "./domain/repositories/schedule-find.repository";
import { ScheduleDeleteRepository } from "./domain/repositories/schedule-delete.repository";
import { PrismaScheduleCreateRepository } from "./infrastructure/persistence/repositories/prisma-schedule-create.repository";
import { PrismaScheduleFindRepository } from "./infrastructure/persistence/repositories/prisma-schedule-find.repository";
import { PrismaScheduleDeleteRepository } from "./infrastructure/persistence/repositories/prisma-schedule-delete.repository";
import { CreateScheduleUseCase } from "./application/use-cases/create-schedule.use-case";
import { ListSchedulesByEmployeeUseCase } from "./application/use-cases/list-schedules-by-employee.use-case";
import { DeleteScheduleUseCase } from "./application/use-cases/delete-schedule.use-case";
import { ScheduleController } from "./presentation/controllers/schedule.controller";
import { EmployeesModule } from "../employees/employee.module";

@Module({
  imports: [EmployeesModule], 
  controllers: [ScheduleController],
  providers: [
    { provide: ScheduleCreateRepository, useClass: PrismaScheduleCreateRepository },
    { provide: ScheduleFindRepository, useClass: PrismaScheduleFindRepository },
    { provide: ScheduleDeleteRepository, useClass: PrismaScheduleDeleteRepository },
    CreateScheduleUseCase,
    ListSchedulesByEmployeeUseCase,
    DeleteScheduleUseCase,
  ],
  exports: [ScheduleFindRepository],
})
export class SchedulesModule {}
