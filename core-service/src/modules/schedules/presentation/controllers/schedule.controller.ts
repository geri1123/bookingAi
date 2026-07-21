import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, Roles, BusinessContextGuard } from "@bookingai/auth";
import { CreateScheduleDto } from "../dto/create-schedule.dto";
import { CreateScheduleUseCase } from "../../application/use-cases/create-schedule.use-case";
import { ListSchedulesByEmployeeUseCase } from "../../application/use-cases/list-schedules-by-employee.use-case";
import { DeleteScheduleUseCase } from "../../application/use-cases/delete-schedule.use-case";


@Controller("employees/:employeeId/schedules")
@UseGuards(BusinessContextGuard)
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly listSchedulesUseCase: ListSchedulesByEmployeeUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
  ) {}

  @Roles("OWNER", "MANAGER")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param("employeeId") employeeId: string,
    @Body() dto: CreateScheduleDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const schedule = await this.createScheduleUseCase.execute({
      employeeId,
      businessId: user.businessId!,
      ...dto,
    });
    return { success: true, schedule: schedule.toPersistence() };
  }

  @Get()
  async list(@Param("employeeId") employeeId: string, @CurrentUser() user: JwtPayload) {
    const schedules = await this.listSchedulesUseCase.execute({ employeeId, businessId: user.businessId! });
    return { success: true, schedules: schedules.map((s) => s.toPersistence()) };
  }

  @Roles("OWNER", "MANAGER")
  @Delete(":scheduleId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("scheduleId") scheduleId: string, @CurrentUser() user: JwtPayload) {
    await this.deleteScheduleUseCase.execute({ scheduleId, businessId: user.businessId! });
  }
}
