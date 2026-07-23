import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { OverlapQuery, ReservationFindRepository } from "../../../domain/repositories/reservation-find.repository";
import { ReservationEntity } from "../../../domain/entities/reservation.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ReservationMapper } from "../mappers/reservation.mapper";

@Injectable()
export class PrismaReservationFindRepository implements ReservationFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ReservationEntity | null> {
    const raw = await this.prisma.reservation.findUnique({ where: { id } });
    return raw ? ReservationMapper.toDomain(raw) : null;
  }

  async findOverlapping(query: OverlapQuery, tx?: TransactionContext): Promise<ReservationEntity[]> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    const resourceOrEmployeeFilter: Prisma.ReservationWhereInput[] = [];
    if (query.employeeId) resourceOrEmployeeFilter.push({ employeeId: query.employeeId });
    if (query.resourceId) resourceOrEmployeeFilter.push({ resourceId: query.resourceId });

    if (resourceOrEmployeeFilter.length === 0) {
      return [];
    }

    const rows = await client.reservation.findMany({
      where: {
        OR: resourceOrEmployeeFilter,
        status: { not: "CANCELLED" },
        startTime: { lt: query.endTime },
        endTime: { gt: query.startTime },
      },
    });
    return rows.map(ReservationMapper.toDomain);
  }

  async findActiveByEmployeeBetween(employeeId: string, from: Date, to: Date): Promise<ReservationEntity[]> {
    const rows = await this.prisma.reservation.findMany({
      where: {
        employeeId,
        status: { not: "CANCELLED" },
        startTime: { lt: to },
        endTime: { gt: from },
      },
      orderBy: { startTime: "asc" },
    });
    return rows.map(ReservationMapper.toDomain);
  }

  async findAllByBusiness(businessId: string, from?: Date, to?: Date): Promise<ReservationEntity[]> {
    const rows = await this.prisma.reservation.findMany({
      where: {
        businessId,
        ...(from || to
          ? {
              startTime: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: { startTime: "asc" },
    });
    return rows.map(ReservationMapper.toDomain);
  }

  async countActiveByCustomer(customerId: string, businessId: string, tx?: TransactionContext): Promise<number> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    return client.reservation.count({
      where: {
        customerId,
        businessId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { gte: new Date() },
      },
    });
  }

  async findFirstAvailableEmployee(
    businessId: string,
    dayOfWeek: number,
    scheduleStartHHMM: string,
    scheduleEndHHMM: string,
    reservationStartTime: Date,
    reservationEndTime: Date,
    tx?: TransactionContext,
  ): Promise<string | null> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    // 1 QUERY: EXISTS kontrollon Schedule (employee punon KETE dite, ne KETE
    // interval), NOT EXISTS kontrollon qe s'ka Reservation qe perputhet.
    // random() shperndan ngarkesen mes disa employees te pershtatshem.
    const rows = await client.$queryRaw<{ id: string }[]>`
      SELECT e.id
      FROM employees e
      WHERE e.business_id = ${businessId}
        AND EXISTS (
          SELECT 1 FROM schedules s
          WHERE s.employee_id = e.id
            AND s.day = ${dayOfWeek}
            AND s.start_time <= ${scheduleStartHHMM}
            AND s.end_time >= ${scheduleEndHHMM}
        )
        AND NOT EXISTS (
          SELECT 1 FROM reservations r
          WHERE r.employee_id = e.id
            AND r.status != 'CANCELLED'
            AND r.start_time < ${reservationEndTime}
            AND r.end_time > ${reservationStartTime}
        )
      ORDER BY random()
      LIMIT 1
    `;

    return rows.length > 0 ? rows[0].id : null;
  }
}