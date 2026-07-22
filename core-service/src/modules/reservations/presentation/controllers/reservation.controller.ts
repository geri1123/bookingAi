import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from "@nestjs/common";
import { CurrentUser, JwtPayload, BusinessContextGuard } from "@bookingai/auth";
import { ListReservationsUseCase } from "../../application/use-cases/list-reservations.use-case";
import { CancelReservationUseCase } from "../../application/use-cases/cancel-reservation.use-case";

// Endpoint PER STAFIN E BIZNESIT (owner/manager/staff) — kerkon JWT + businessId,
// per me pare/anulu rezervimet nga dashboard-i, ndryshe nga PublicReservationController.
@Controller("reservations")
@UseGuards(BusinessContextGuard)
export class ReservationController {
  constructor(
    private readonly listReservationsUseCase: ListReservationsUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
  ) {}

  @Get()
  async list(
    @CurrentUser() user: JwtPayload,
    @Query("from") from?: string,
    @Query("to") to?: string,
  ) {
    const reservations = await this.listReservationsUseCase.execute({
      businessId: user.businessId!,
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    return { success: true, reservations: reservations.map((r) => r.toPersistence()) };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async cancel(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    const reservation = await this.cancelReservationUseCase.execute({
      reservationId: id,
      businessId: user.businessId!,
    });
    return { success: true, reservation: reservation.toPersistence() };
  }
}
