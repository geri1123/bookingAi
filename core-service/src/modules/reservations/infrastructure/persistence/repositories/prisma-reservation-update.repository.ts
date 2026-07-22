import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ReservationUpdateRepository } from "../../../domain/repositories/reservation-update.repository";
import { ReservationEntity } from "../../../domain/entities/reservation.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { ReservationMapper } from "../mappers/reservation.mapper";

@Injectable()
export class PrismaReservationUpdateRepository implements ReservationUpdateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async update(reservation: ReservationEntity, tx?: TransactionContext): Promise<ReservationEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const props = reservation.toPersistence();
    const updated = await client.reservation.update({
      where: { id: props.id },
      data: { status: props.status },
    });
    return ReservationMapper.toDomain(updated);
  }
}
