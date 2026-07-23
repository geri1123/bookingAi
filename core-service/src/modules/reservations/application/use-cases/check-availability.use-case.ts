import { HttpStatus, Injectable } from "@nestjs/common";
import { AppException } from "../../../../common/exceptions/app.exception";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";

import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";
import { ServicePricingUnit } from "../../../services/domain/entities/service.entity";

import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { EmployeeErrorCode } from "../../../employees/domain/errors/employee-error-codes.enum";

import { ScheduleFindRepository } from "../../../schedules/domain/repositories/schedule-find.repository";

export interface CheckAvailabilityInput {
  businessId: string;
  serviceId: string;
  date: string; // "YYYY-MM-DD"
  employeeId?: string;
}

export interface AvailabilitySlot {
  startTime: Date;
  endTime: Date;
}

export interface EmployeeAvailability {
  employeeId: string;
  employeeName: string;
  slots: AvailabilitySlot[];
}

const HHMM_TO_MINUTES = (hhmm: string): number => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

@Injectable()
export class CheckAvailabilityUseCase {
  constructor(
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly reservationFindRepo: ReservationFindRepository,
  ) {}

  async execute(input: CheckAvailabilityInput): Promise<EmployeeAvailability[]> {
    const service = await this.serviceFindRepo.findById(input.serviceId);
    if (!service || service.businessId !== input.businessId) {
      throw new AppException(ReservationErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }

    
    if (service.pricingUnit !== ServicePricingUnit.FIXED || !service.duration) {
      throw new AppException(
        ReservationErrorCode.DURATION_REQUIRED,
        { field: "serviceId" },
        HttpStatus.BAD_REQUEST,
      );
    }

    let employees = input.employeeId
      ? [await this.employeeFindRepo.findById(input.employeeId)]
      : await this.employeeFindRepo.findAllByBusiness(input.businessId);

    employees = employees.filter((e) => e && e.businessId === input.businessId);

    if (input.employeeId && employees.length === 0) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    const dayOfWeek = new Date(`${input.date}T00:00:00`).getDay(); // 0=diel ... 6=shtune
    const durationMinutes = service.duration;

    const result: EmployeeAvailability[] = [];

    for (const employee of employees) {
      if (!employee) continue;

      const schedules = (await this.scheduleFindRepo.findAllByEmployee(employee.id)).filter(
        (s) => s.day === dayOfWeek,
      );

      if (schedules.length === 0) continue;

      const slots: AvailabilitySlot[] = [];

      for (const schedule of schedules) {
        const windowStart = new Date(`${input.date}T${schedule.startTime}:00`);
        const windowEnd = new Date(`${input.date}T${schedule.endTime}:00`);

        const busy = await this.reservationFindRepo.findActiveByEmployeeBetween(
          employee.id,
          windowStart,
          windowEnd,
        );

        let cursor = HHMM_TO_MINUTES(schedule.startTime);
        const windowEndMinutes = HHMM_TO_MINUTES(schedule.endTime);

        while (cursor + durationMinutes <= windowEndMinutes) {
          const slotStart = new Date(windowStart.getTime() + (cursor - HHMM_TO_MINUTES(schedule.startTime)) * 60_000);
          const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000);

          const conflicts = busy.some((r) => slotStart < r.endTime && slotEnd > r.startTime);

          if (!conflicts && slotStart.getTime() > Date.now()) {
            slots.push({ startTime: slotStart, endTime: slotEnd });
          }

          cursor += durationMinutes;
        }
      }

      if (slots.length > 0) {
        result.push({ employeeId: employee.id, employeeName: employee.name, slots });
      }
    }

    return result;
  }
}
