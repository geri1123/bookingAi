import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, BusinessContextGuard } from "@bookingai/auth";
import { ListCustomersQueryDto } from "../dto/list-customers-query.dto";
import { ListCustomersUseCase } from "../../application/use-cases/list-customers.use-case";

@Controller("customers")
@UseGuards(BusinessContextGuard)
export class CustomerController {
  constructor(private readonly listCustomersUseCase: ListCustomersUseCase) {}

  @Get()
  async list(@Query() query: ListCustomersQueryDto, @CurrentUser() user: JwtPayload) {
    const { customers, total } = await this.listCustomersUseCase.execute({
      businessId: user.businessId!,
      offset: query.offset,
    });
    return { success: true, customers: customers.map((c) => c.toPersistence()), total };
  }
}