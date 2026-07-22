import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, Roles, BusinessContextGuard } from "@bookingai/auth";
import { CreateResourceDto } from "../dto/create-resource.dto";
import { UpdateResourceDto } from "../dto/update-resource.dto";
import { CreateResourceUseCase } from "../../application/use-cases/create-resource.use-case";
import { ListResourcesUseCase } from "../../application/use-cases/list-resources.use-case";
import { UpdateResourceUseCase } from "../../application/use-cases/update-resource.use-case";
import { DeleteResourceUseCase } from "../../application/use-cases/delete-resource.use-case";

@Controller("resources")
@UseGuards(BusinessContextGuard)
export class ResourceController {
  constructor(
    private readonly createResourceUseCase: CreateResourceUseCase,
    private readonly listResourcesUseCase: ListResourcesUseCase,
    private readonly updateResourceUseCase: UpdateResourceUseCase,
    private readonly deleteResourceUseCase: DeleteResourceUseCase,
  ) {}

  @Roles("OWNER", "MANAGER")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateResourceDto, @CurrentUser() user: JwtPayload) {
    const resource = await this.createResourceUseCase.execute({ businessId: user.businessId!, ...dto });
    return { success: true, resource: resource.toPersistence() };
  }

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const resources = await this.listResourcesUseCase.execute(user.businessId!);
    return { success: true, resources: resources.map((r) => r.toPersistence()) };
  }

  @Roles("OWNER", "MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateResourceDto, @CurrentUser() user: JwtPayload) {
    const resource = await this.updateResourceUseCase.execute({
      resourceId: id,
      businessId: user.businessId!,
      ...dto,
    });
    return { success: true, resource: resource.toPersistence() };
  }

  @Roles("OWNER", "MANAGER")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    await this.deleteResourceUseCase.execute({ resourceId: id, businessId: user.businessId! });
  }
}
