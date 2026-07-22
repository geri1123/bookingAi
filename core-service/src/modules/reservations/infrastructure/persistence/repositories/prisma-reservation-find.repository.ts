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
      // s'ka employeeId as resourceId — s'ka mundesi konflikti fizik, kthe bosh
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
}