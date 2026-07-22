import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ReservationCreateRepository } from "../../../domain/repositories/reservation-create.repository";
import { ReservationEntity } from "../../../domain/entities/reservation.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ReservationMapper } from "../mappers/reservation.mapper";

@Injectable()
export class PrismaReservationCreateRepository implements ReservationCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(reservation: ReservationEntity, tx?: TransactionContext): Promise<ReservationEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const created = await client.reservation.create({ data: ReservationMapper.toPersistence(reservation) });
    return ReservationMapper.toDomain(created);
  }
}
