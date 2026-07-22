import { Reservation as PrismaReservation, Prisma } from "@prisma/client";
import { ReservationEntity, ReservationStatus } from "../../../domain/entities/reservation.entity";

export class ReservationMapper {
  static toDomain(raw: PrismaReservation): ReservationEntity {
    return ReservationEntity.reconstitute({
      id: raw.id,
      businessId: raw.businessId,
      customerId: raw.customerId,
      serviceId: raw.serviceId,
      resourceId: raw.resourceId,
      employeeId: raw.employeeId,
      partySize: raw.partySize,
      startTime: raw.startTime,
      endTime: raw.endTime,
      status: raw.status as ReservationStatus,
      createdAt: raw.createdAt,
    });
  }

  static toPersistence(entity: ReservationEntity): Prisma.ReservationUncheckedCreateInput {
    const props = entity.toPersistence();
    return {
      id: props.id,
      businessId: props.businessId,
      customerId: props.customerId,
      serviceId: props.serviceId,
      resourceId: props.resourceId,
      employeeId: props.employeeId,
      partySize: props.partySize,
      startTime: props.startTime,
      endTime: props.endTime,
      status: props.status,
    };
  }
}
