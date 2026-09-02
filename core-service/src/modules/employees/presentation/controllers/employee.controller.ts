import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, Roles, BusinessContextGuard } from "@bookingai/auth";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { CreateEmployeeUseCase } from "../../application/use-cases/create-employee.use-case";
import { ListEmployeesUseCase } from "../../application/use-cases/list-employees.use-case";
import { UpdateEmployeeUseCase } from "../../application/use-cases/update-employee.use-case";
import { DeleteEmployeeUseCase } from "../../application/use-cases/delete-employee.use-case";

@Controller("employees")
@UseGuards(BusinessContextGuard)
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly listEmployeesUseCase: ListEmployeesUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly deleteEmployeeUseCase: DeleteEmployeeUseCase,
  ) {}

  @Roles("OWNER", "MANAGER")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateEmployeeDto, @CurrentUser() user: JwtPayload) {
    const employee = await this.createEmployeeUseCase.execute({ businessId: user.businessId!, ...dto });
    return { success: true, employee: employee.toPersistence() };
  }

@Get()
async list(
  @CurrentUser() user: JwtPayload,
  @Query("page") page?: string,
) {
  const result = await this.listEmployeesUseCase.execute({
    businessId: user.businessId!,
    page: page ? Number(page) : 1,
  });
  return { success: true, employees: result.items.map((e) => e.toPersistence()), total: result.total };
}
  @Roles("OWNER", "MANAGER")
  @Put(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateEmployeeDto, @CurrentUser() user: JwtPayload) {
    const employee = await this.updateEmployeeUseCase.execute({
      employeeId: id,
      businessId: user.businessId!,
      ...dto,
    });
    return { success: true, employee: employee.toPersistence() };
  }

  @Roles("OWNER", "MANAGER")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    await this.deleteEmployeeUseCase.execute({ employeeId: id, businessId: user.businessId! });
  }
}
