import { Module } from "@nestjs/common";
import { CustomerFindRepository } from "./domain/repositories/customer-find.repository";
import { CustomerCreateRepository } from "./domain/repositories/customer-create.repository";
import { PrismaCustomerFindRepository } from "./infrastructure/persistence/repositories/prisma-customer-find.repository";
import { PrismaCustomerCreateRepository } from "./infrastructure/persistence/repositories/prisma-customer-create.repository";

// Modul thjeshte, pa controller te vetin per tani — Customer krijohet
// gjithmone brenda CreateReservationUseCase (find-or-create sipas telefonit).
// Nese nesër duhet nje panel "Customers" per business owner, shtohet
// nje ListCustomersUseCase + CustomerController ketu, pa prekur asgje tjeter.
@Module({
  providers: [
    { provide: CustomerFindRepository, useClass: PrismaCustomerFindRepository },
    { provide: CustomerCreateRepository, useClass: PrismaCustomerCreateRepository },
  ],
  exports: [CustomerFindRepository, CustomerCreateRepository],
})
export class CustomersModule {}
