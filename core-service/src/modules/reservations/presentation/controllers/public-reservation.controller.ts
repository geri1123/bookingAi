import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from "@nestjs/common";
import { Public } from "@bookingai/auth";
import { CreateReservationDto } from "../dto/create-reservation.dto";
import { AvailabilityQueryDto } from "../dto/availability-query.dto";
import { AvailableResourcesQueryDto } from "../dto/available-resources-query.dto";
import { CreateReservationUseCase } from "../../application/use-cases/create-reservation.use-case";
import { CheckAvailabilityUseCase } from "../../application/use-cases/check-availability.use-case";
import { CheckResourceAvailabilityUseCase } from "../../application/use-cases/check-resource-availability.use-case";

// Endpoint PUBLIK — s'ka JWT, s'ka BusinessContextGuard.
// businessId vjen nga URL, jo nga token, sepse customer-i fundor s'ka llogari.
// E thirrasin: (1) widget/app-i i platformes per klientin fundor,
//              (2) ai-service, kur AI vendos qe duhet rezervim/kontroll disponueshmerie.
@Controller("public/:businessId")
export class PublicReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly checkAvailabilityUseCase: CheckAvailabilityUseCase,
    private readonly checkResourceAvailabilityUseCase: CheckResourceAvailabilityUseCase,
  ) {}

  // Per biznese ME employee (SALON, DENTIST, etj) — sllote sipas Schedule.
  @Public()
  @Get("availability")
  @HttpCode(HttpStatus.OK)
  async availability(@Param("businessId") businessId: string, @Query() query: AvailabilityQueryDto) {
    const result = await this.checkAvailabilityUseCase.execute({
      businessId,
      serviceId: query.serviceId,
      date: query.date,
      employeeId: query.employeeId,
    });
    return { success: true, availability: result };
  }

  // Per biznese PA employee, me resources (RESTAURANT/HOTEL) — tavolina/dhoma
  // te lira per nje interval kohor + partySize/type te caktuar.
  @Public()
  @Get("available-resources")
  @HttpCode(HttpStatus.OK)
  async availableResources(
    @Param("businessId") businessId: string,
    @Query() query: AvailableResourcesQueryDto,
  ) {
    const resources = await this.checkResourceAvailabilityUseCase.execute({
      businessId,
      startTime: new Date(query.startTime),
      endTime: new Date(query.endTime),
      partySize: query.partySize,
      resourceType: query.resourceType,
    });
    return { success: true, resources: resources.map((r) => r.toPersistence()) };
  }

  @Public()
  @Post("reservations")
  @HttpCode(HttpStatus.CREATED)
  async create(@Param("businessId") businessId: string, @Body() dto: CreateReservationDto) {
    const reservation = await this.createReservationUseCase.execute({
      businessId,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      serviceId: dto.serviceId,
      employeeId: dto.employeeId,
      resourceId: dto.resourceId,
      partySize: dto.partySize,
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
    });

    return { success: true, reservation: reservation.toPersistence() };
  }
}