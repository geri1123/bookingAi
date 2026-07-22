import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ReservationErrorCode } from "../errors/reservation-error-codes.enum";

// vlerat perputhen SAKTE me enum ReservationStatus te schema.prisma
export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
}

export interface ReservationProps {
  id: string;
  businessId: string;
  customerId: string;
  serviceId: string;
  resourceId: string | null;
  employeeId: string | null;
  partySize: number | null;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  createdAt: Date;
}

export interface NewReservationProps {
  businessId: string;
  customerId: string;
  serviceId: string;
  resourceId?: string | null;
  employeeId?: string | null;
  partySize?: number | null;
  startTime: Date;
  endTime: Date;
}

export class ReservationEntity {
  private constructor(private props: ReservationProps) {}

  static create(props: NewReservationProps): ReservationEntity {
    if (!(props.startTime instanceof Date) || !(props.endTime instanceof Date)) {
      throw new AppException(ReservationErrorCode.INVALID_TIME_RANGE, { field: "startTime/endTime" }, HttpStatus.BAD_REQUEST);
    }

    if (props.startTime >= props.endTime) {
      throw new AppException(ReservationErrorCode.INVALID_TIME_RANGE, { field: "endTime" }, HttpStatus.BAD_REQUEST);
    }

    if (props.startTime.getTime() < Date.now()) {
      throw new AppException(ReservationErrorCode.START_TIME_IN_PAST, { field: "startTime" }, HttpStatus.BAD_REQUEST);
    }

    if (!props.employeeId && !props.resourceId) {
      // te pakten njeri prej tyre duhet, PERVEC nese biznesi s'ka nevoje per asnjerin
      // (kontrolli real sipas ACTIVATION_REQUIREMENTS behet ne use case, jo ketu —
      //  entity-ja s'e njeh BusinessType)
    }

    return new ReservationEntity({
      id: randomUUID(),
      businessId: props.businessId,
      customerId: props.customerId,
      serviceId: props.serviceId,
      resourceId: props.resourceId ?? null,
      employeeId: props.employeeId ?? null,
      partySize: props.partySize ?? null,
      startTime: props.startTime,
      endTime: props.endTime,
      status: ReservationStatus.CONFIRMED,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: ReservationProps): ReservationEntity {
    return new ReservationEntity(props);
  }

  cancel(): void {
    if (this.props.status === ReservationStatus.CANCELLED) {
      throw new AppException(ReservationErrorCode.ALREADY_CANCELLED, { field: "status" }, HttpStatus.CONFLICT);
    }
    if (this.props.status === ReservationStatus.COMPLETED) {
      throw new AppException(ReservationErrorCode.ALREADY_COMPLETED, { field: "status" }, HttpStatus.CONFLICT);
    }
    this.props.status = ReservationStatus.CANCELLED;
  }

  get id() { return this.props.id; }
  get businessId() { return this.props.businessId; }
  get customerId() { return this.props.customerId; }
  get serviceId() { return this.props.serviceId; }
  get resourceId() { return this.props.resourceId; }
  get employeeId() { return this.props.employeeId; }
  get partySize() { return this.props.partySize; }
  get startTime() { return this.props.startTime; }
  get endTime() { return this.props.endTime; }
  get status() { return this.props.status; }
  get createdAt() { return this.props.createdAt; }

  toPersistence(): ReservationProps {
    return { ...this.props };
  }
}
