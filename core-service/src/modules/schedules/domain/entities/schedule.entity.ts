import { randomUUID } from "crypto";
import { HttpStatus } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ScheduleErrorCode } from "../errors/schedule-error-codes.enum";

export interface ScheduleProps {
  id: string;
  employeeId: string;
  day: number; // 0 = e diel ... 6 = e shtune
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  createdAt: Date;
}

export interface NewScheduleProps {
  employeeId: string;
  day: number;
  startTime: string;
  endTime: string;
}

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class ScheduleEntity {
  private constructor(private props: ScheduleProps) {}

  static create(props: NewScheduleProps): ScheduleEntity {
    if (props.day < 0 || props.day > 6) {
      throw new AppException(ScheduleErrorCode.INVALID_DAY, { field: "day" }, HttpStatus.BAD_REQUEST);
    }

    if (!TIME_REGEX.test(props.startTime) || !TIME_REGEX.test(props.endTime)) {
      throw new AppException(
        ScheduleErrorCode.INVALID_TIME_FORMAT,
        { field: "startTime/endTime" },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (props.startTime >= props.endTime) {
      // krahasim string OK per formatin HH:mm (lexikografik = kronologjik)
      throw new AppException(ScheduleErrorCode.END_BEFORE_START, { field: "endTime" }, HttpStatus.BAD_REQUEST);
    }

    return new ScheduleEntity({
      id: randomUUID(),
      employeeId: props.employeeId,
      day: props.day,
      startTime: props.startTime,
      endTime: props.endTime,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: ScheduleProps): ScheduleEntity {
    return new ScheduleEntity(props);
  }

  get id() { return this.props.id; }
  get employeeId() { return this.props.employeeId; }
  get day() { return this.props.day; }
  get startTime() { return this.props.startTime; }
  get endTime() { return this.props.endTime; }
  get createdAt() { return this.props.createdAt; }

  toPersistence(): ScheduleProps {
    return { ...this.props };
  }
}
