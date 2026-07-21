import { HttpStatus, Injectable } from "@nestjs/common";
import { ScheduleEntity } from "../../domain/entities/schedule.entity";
import { ScheduleCreateRepository } from "../../domain/repositories/schedule-create.repository";
import { ScheduleFindRepository } from "../../domain/repositories/schedule-find.repository";
import { ScheduleErrorCode } from "../../domain/errors/schedule-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { EmployeeErrorCode } from "../../../employees/domain/errors/employee-error-codes.enum";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface CreateScheduleInput {
  employeeId: string;
  businessId: string;
  day: number;
  startTime: string;
  endTime: string;
}

@Injectable()
export class CreateScheduleUseCase {
  constructor(
    private readonly scheduleCreateRepo: ScheduleCreateRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CreateScheduleInput): Promise<ScheduleEntity> {
    const employee = await this.employeeFindRepo.findById(input.employeeId);

    if (!employee || employee.businessId !== input.businessId) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    const schedule = ScheduleEntity.create({
      employeeId: input.employeeId,
      day: input.day,
      startTime: input.startTime,
      endTime: input.endTime,
    });

    const overlapping = await this.scheduleFindRepo.findOverlapping(
      input.employeeId,
      schedule.day,
      schedule.startTime,
      schedule.endTime,
    );

    if (overlapping.length > 0) {
      throw new AppException(
        ScheduleErrorCode.OVERLAPPING_SCHEDULE,
        { field: "startTime/endTime" },
        HttpStatus.CONFLICT,
      );
    }

    const created = await this.scheduleCreateRepo.create(schedule);

    await this.outboxWriter.write(EventName.SCHEDULE_CREATED, schedule.id, {
      businessId: input.businessId,
      scheduleId: schedule.id,
      employeeId: input.employeeId,
    });

    return created;
  }
}
