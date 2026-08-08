import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { Public } from "@bookingai/auth";
import { CreateReservationDto } from "../dto/create-reservation.dto";
import { AvailabilityQueryDto } from "../dto/availability-query.dto";
import { AvailableResourcesQueryDto } from "../dto/available-resources-query.dto";
import { LookupReservationsQueryDto } from "../dto/lookup-reservations-query.dto";
import { RescheduleReservationDto } from "../dto/reschedule-reservation.dto";
import { CancelReservationDto } from "../dto/cancel-reservation.dto";
import { CreateReservationUseCase } from "../../application/use-cases/create-reservation.use-case";
import { CheckAvailabilityUseCase } from "../../application/use-cases/check-availability.use-case";
import { CheckResourceAvailabilityUseCase } from "../../application/use-cases/check-resource-availability.use-case";
import { FindCustomerReservationsUseCase } from "../../application/use-cases/find-customer-reservations.use-case";
import { RescheduleReservationUseCase } from "../../application/use-cases/reschedule-reservation.use-case";
import { CancelReservationUseCase } from "../../application/use-cases/cancel-reservation.use-case";


@Controller("public/:businessId")
export class PublicReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly checkAvailabilityUseCase: CheckAvailabilityUseCase,
    private readonly checkResourceAvailabilityUseCase: CheckResourceAvailabilityUseCase,
    private readonly findCustomerReservationsUseCase: FindCustomerReservationsUseCase,
    private readonly rescheduleReservationUseCase: RescheduleReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
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

 
  @Public()
  @Get("reservations/lookup")
  @HttpCode(HttpStatus.OK)
  async lookupByPhone(@Param("businessId") businessId: string, @Query() query: LookupReservationsQueryDto) {
    const reservations = await this.findCustomerReservationsUseCase.execute({
      businessId,
      phone: query.phone,
    });
    return { success: true, reservations };
  }

  // Ndryshon oren e nje rezervimi ekzistues. Kerkon 'phone' per te verifikuar qe
  // kerkesa vjen nga vete klienti pronar i rezervimit.
  @Public()
  @Patch("reservations/:id/reschedule")
  @HttpCode(HttpStatus.OK)
  async reschedule(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: RescheduleReservationDto,
  ) {
    const reservation = await this.rescheduleReservationUseCase.execute({
      reservationId: id,
      businessId,
      phone: dto.phone,
      startTime: new Date(dto.startTime),
      endTime: dto.endTime ? new Date(dto.endTime) : undefined,
    });
    return { success: true, reservation: reservation.toPersistence() };
  }

 
  @Public()
  @Post("reservations/:id/cancel")
  @HttpCode(HttpStatus.OK)
  async cancel(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: CancelReservationDto,
  ) {
    const reservation = await this.cancelReservationUseCase.execute({
      reservationId: id,
      businessId,
      phone: dto.phone,
    });
    return { success: true, reservation: reservation.toPersistence() };
  }
}