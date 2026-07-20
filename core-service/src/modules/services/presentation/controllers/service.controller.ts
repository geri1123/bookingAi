import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, Roles, BusinessContextGuard } from "@bookingai/auth";
import { CreateServiceDto } from "../dto/create-service.dto";
import { UpdateServiceDto } from "../dto/update-service.dto";
import { CreateServiceUseCase } from "../../application/use-cases/create-service.use-case";
import { ListServicesUseCase } from "../../application/use-cases/list-services.use-case";
import { UpdateServiceUseCase } from "../../application/use-cases/update-service.use-case";
import { DeleteServiceUseCase } from "../../application/use-cases/delete-service.use-case";

@Controller("services")
@UseGuards(BusinessContextGuard)
export class ServiceController {
  constructor(
    private readonly createServiceUseCase: CreateServiceUseCase,
    private readonly listServicesUseCase: ListServicesUseCase,
    private readonly updateServiceUseCase: UpdateServiceUseCase,
    private readonly deleteServiceUseCase: DeleteServiceUseCase,
  ) {}

  @Roles("OWNER", "MANAGER")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateServiceDto, @CurrentUser() user: JwtPayload) {
    const service = await this.createServiceUseCase.execute({ businessId: user.businessId!, ...dto });
    return { success: true, service: service.toPersistence() };
  }

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const services = await this.listServicesUseCase.execute(user.businessId!);
    return { success: true, services: services.map((s) => s.toPersistence()) };
  }

  @Roles("OWNER", "MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateServiceDto, @CurrentUser() user: JwtPayload) {
    const service = await this.updateServiceUseCase.execute({
      serviceId: id,
      businessId: user.businessId!,
      ...dto,
    });
    return { success: true, service: service.toPersistence() };
  }

  @Roles("OWNER", "MANAGER")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    await this.deleteServiceUseCase.execute({ serviceId: id, businessId: user.businessId! });
  }
}