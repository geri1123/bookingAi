import { Module } from "@nestjs/common";

import { ReservationCreateRepository } from "./domain/repositories/reservation-create.repository";
import { ReservationFindRepository } from "./domain/repositories/reservation-find.repository";
import { ReservationUpdateRepository } from "./domain/repositories/reservation-update.repository";
import { PrismaReservationCreateRepository } from "./infrastructure/persistence/repositories/prisma-reservation-create.repository";
import { PrismaReservationFindRepository } from "./infrastructure/persistence/repositories/prisma-reservation-find.repository";
import { PrismaReservationUpdateRepository } from "./infrastructure/persistence/repositories/prisma-reservation-update.repository";

import { CreateReservationUseCase } from "./application/use-cases/create-reservation.use-case";
import { CheckAvailabilityUseCase } from "./application/use-cases/check-availability.use-case";
import { CheckResourceAvailabilityUseCase } from "./application/use-cases/check-resource-availability.use-case";
import { CancelReservationUseCase } from "./application/use-cases/cancel-reservation.use-case";
import { ListReservationsUseCase } from "./application/use-cases/list-reservations.use-case";

import { PublicReservationController } from "./presentation/controllers/public-reservation.controller";
import { ReservationController } from "./presentation/controllers/reservation.controller";

import { CustomersModule } from "../customers/customers.module";
import { ServicesModule } from "../services/services.module";
import { EmployeesModule } from "../employees/employee.module";
import { SchedulesModule } from "../schedules/schedules.module";
import { ResourcesModule } from "../resources/resources.module";
import { BusinessModule } from "../business/bussines.module";


@Module({
  imports: [CustomersModule, ServicesModule, EmployeesModule, SchedulesModule, ResourcesModule, BusinessModule],
  controllers: [PublicReservationController, ReservationController],
  providers: [
    { provide: ReservationCreateRepository, useClass: PrismaReservationCreateRepository },
    { provide: ReservationFindRepository, useClass: PrismaReservationFindRepository },
    { provide: ReservationUpdateRepository, useClass: PrismaReservationUpdateRepository },
    CreateReservationUseCase,
    CheckAvailabilityUseCase,
    CheckResourceAvailabilityUseCase,
    CancelReservationUseCase,
    ListReservationsUseCase,
  ],
  exports: [ReservationFindRepository],
})
export class ReservationsModule {}