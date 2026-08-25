import { Module } from "@nestjs/common";
import { CustomerFindRepository } from "./domain/repositories/customer-find.repository";
import { CustomerCreateRepository } from "./domain/repositories/customer-create.repository";
import { PrismaCustomerFindRepository } from "./infrastructure/persistence/repositories/prisma-customer-find.repository";
import { PrismaCustomerCreateRepository } from "./infrastructure/persistence/repositories/prisma-customer-create.repository";
import { CustomerController } from "./presentation/controllers/customer.controller";
import { ListCustomersUseCase } from "./application/use-cases/list-customers.use-case";


@Module({
  providers: [
    { provide: CustomerFindRepository, useClass: PrismaCustomerFindRepository },
    { provide: CustomerCreateRepository, useClass: PrismaCustomerCreateRepository },
    ListCustomersUseCase
  ],
  controllers: [CustomerController],
  exports: [CustomerFindRepository, CustomerCreateRepository],
})
export class CustomersModule {}
