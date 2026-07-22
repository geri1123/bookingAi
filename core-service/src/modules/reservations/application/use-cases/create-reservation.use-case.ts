import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { ReservationErrorCode } from "../../domain/errors/reservation-error-codes.enum";
import { ReservationCreateRepository } from "../../domain/repositories/reservation-create.repository";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";

import { CustomerFindRepository } from "../../../customers/domain/repositories/customer-find.repository";
import { CustomerCreateRepository } from "../../../customers/domain/repositories/customer-create.repository";
import { CustomerEntity } from "../../../customers/domain/entities/customer.entity";

import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";
import { ServicePricingUnit } from "../../../services/domain/entities/service.entity";

import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { EmployeeErrorCode } from "../../../employees/domain/errors/employee-error-codes.enum";

import { ScheduleFindRepository } from "../../../schedules/domain/repositories/schedule-find.repository";

import { ResourceFindRepository } from "../../../resources/domain/repositories/resource-find.repository";
import { ResourceErrorCode } from "../../../resources/domain/errors/resource-error-codes.enum";

import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";
import { TransactionContext } from "../../../../common/domain/transaction-context";

export interface CreateReservationInput {
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  serviceId: string;
  // employeeId/resourceId TANI JANE VETEM PER OVERRIDE MANUAL (p.sh. panel admini,
  // ose AI qe DON nje punonjes specifik). Klienti fundor NUK i jep kurre —
  // sistemi GJEN VETE (auto-assign) sipas business.type.
  employeeId?: string;
  resourceId?: string;
  partySize?: number;
  startTime: Date;
  endTime?: Date; // opsionale — llogaritet nga service.duration nese pricingUnit=FIXED
}

// nderron renditjen e nje array pa e mutu origjinalin — perdoret qe auto-assign
// s'i jep GJITHMONE punes se PARIT ne DB te njejtin employee/resource (shperndarje
// me e barabarte, jo favorizim i pa-qellimshem i te parit te krijuar)
function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reservationCreateRepo: ReservationCreateRepository,
    private readonly reservationFindRepo: ReservationFindRepository,
    private readonly customerFindRepo: CustomerFindRepository,
    private readonly customerCreateRepo: CustomerCreateRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CreateReservationInput): Promise<ReservationEntity> {
   
    const service = await this.serviceFindRepo.findById(input.serviceId);
    if (!service || service.businessId !== input.businessId) {
      throw new AppException(ReservationErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }


    if (input.employeeId) {
      const employee = await this.employeeFindRepo.findById(input.employeeId);
      if (!employee || employee.businessId !== input.businessId) {
        throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
      }
    }

    if (input.resourceId) {
      const resource = await this.resourceFindRepo.findById(input.resourceId);
      if (!resource || resource.businessId !== input.businessId) {
        throw new AppException(ResourceErrorCode.NOT_FOUND, { field: "resourceId" }, HttpStatus.NOT_FOUND);
      }
    }


    const endTime = input.endTime ?? this.computeEndTime(input.startTime, service);

    if (input.employeeId) {
      const withinWorkingHours = await this.isWithinWorkingHours(input.employeeId, input.startTime, endTime);
      if (!withinWorkingHours) {
        throw new AppException(
          ReservationErrorCode.OUTSIDE_WORKING_HOURS,
          { field: "startTime" },
          HttpStatus.CONFLICT,
        );
      }
    }

   
    const needsAutoAssign = !input.employeeId && !input.resourceId;
    let autoAssignMode: "EMPLOYEE" | "RESOURCE" | "NONE" = "NONE";

    if (needsAutoAssign) {
      const business = await this.businessFindRepo.findById(input.businessId);
      if (!business) {
        throw new AppException(ReservationErrorCode.SERVICE_NOT_FOUND, { field: "businessId" }, HttpStatus.NOT_FOUND);
      }
      const req = ACTIVATION_REQUIREMENTS[business.type];
      autoAssignMode = req.needsEmployee ? "EMPLOYEE" : req.needsResource ? "RESOURCE" : "NONE";
    }

   
    const reservation = await this.prisma.$transaction(async (tx) => {
   
      const lockKey = input.employeeId ?? input.resourceId ?? (needsAutoAssign ? input.businessId : undefined);
      if (lockKey) {
        await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey})::bigint)`;
      }

      let resolvedEmployeeId = input.employeeId ?? null;
      let resolvedResourceId = input.resourceId ?? null;

      if (autoAssignMode === "EMPLOYEE") {
        resolvedEmployeeId = await this.autoAssignEmployee(input.businessId, input.startTime, endTime, tx);
      } else if (autoAssignMode === "RESOURCE") {
        resolvedResourceId = await this.autoAssignResource(
          input.businessId,
          input.startTime,
          endTime,
          input.partySize,
          tx,
        );
      } else if (!needsAutoAssign) {
        
        const overlapping = await this.reservationFindRepo.findOverlapping(
          {
            employeeId: input.employeeId ?? null,
            resourceId: input.resourceId ?? null,
            startTime: input.startTime,
            endTime,
          },
          tx,
        );
        if (overlapping.length > 0) {
          throw new AppException(ReservationErrorCode.SLOT_TAKEN, { field: "startTime" }, HttpStatus.CONFLICT);
        }
      }
     
      let customer = await this.customerFindRepo.findByPhone(input.businessId, input.phone, tx);

      if (!customer) {
        const newCustomer = CustomerEntity.create({
          businessId: input.businessId,
          name: input.name,
          phone: input.phone,
          email: input.email,
        });
        customer = await this.customerCreateRepo.create(newCustomer, tx);
      }

      const entity = ReservationEntity.create({
        businessId: input.businessId,
        customerId: customer.id,
        serviceId: input.serviceId,
        employeeId: resolvedEmployeeId,
        resourceId: resolvedResourceId,
        partySize: input.partySize ?? null,
        startTime: input.startTime,
        endTime,
      });

      const created = await this.reservationCreateRepo.create(entity, tx);

      // Kafka: VETEM njoftim/efekt anesor — reservation tashme eshte NE DB.
      await this.outboxWriter.write(
        EventName.RESERVATION_CREATED,
        created.id,
        {
          reservationId: created.id,
          businessId: input.businessId,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          serviceId: service.id,
          serviceName: service.name,
          employeeId: resolvedEmployeeId,
          resourceId: resolvedResourceId,
          startTime: created.startTime,
          endTime: created.endTime,
        },
        tx,
      );

      return created;
    });

    return reservation;
  }

  
  private async autoAssignEmployee(
    businessId: string,
    startTime: Date,
    endTime: Date,
    tx: TransactionContext,
  ): Promise<string> {
    const candidates = shuffle(await this.employeeFindRepo.findAllByBusiness(businessId));

    if (candidates.length === 0) {
      throw new AppException(EmployeeErrorCode.EMPLOYEE_NOT_FOUND, { field: "employeeId" }, HttpStatus.NOT_FOUND);
    }

    for (const candidate of candidates) {
      const withinWorkingHours = await this.isWithinWorkingHours(candidate.id, startTime, endTime);
      if (!withinWorkingHours) continue;

      const conflicts = await this.reservationFindRepo.findOverlapping(
        { employeeId: candidate.id, startTime, endTime },
        tx,
      );
      if (conflicts.length === 0) return candidate.id;
    }

    throw new AppException(ReservationErrorCode.SLOT_TAKEN, { field: "startTime" }, HttpStatus.CONFLICT);
  }

  
  private async autoAssignResource(
    businessId: string,
    startTime: Date,
    endTime: Date,
    partySize: number | undefined,
    tx: TransactionContext,
  ): Promise<string> {
    const allResources = await this.resourceFindRepo.findAllByBusiness(businessId);
    const eligible = shuffle(
      partySize ? allResources.filter((r) => r.capacity >= partySize) : allResources,
    );

    if (eligible.length === 0) {
      throw new AppException(ResourceErrorCode.NOT_FOUND, { field: "partySize" }, HttpStatus.NOT_FOUND);
    }

    for (const candidate of eligible) {
      const conflicts = await this.reservationFindRepo.findOverlapping(
        { resourceId: candidate.id, startTime, endTime },
        tx,
      );
      if (conflicts.length === 0) return candidate.id;
    }

    throw new AppException(ReservationErrorCode.SLOT_TAKEN, { field: "resourceId" }, HttpStatus.CONFLICT);
  }

  private async isWithinWorkingHours(employeeId: string, startTime: Date, endTime: Date): Promise<boolean> {
    const dayOfWeek = startTime.getDay(); // 0=diel ... 6=shtune, njesoj si Schedule.day
    const schedules = (await this.scheduleFindRepo.findAllByEmployee(employeeId)).filter(
      (s) => s.day === dayOfWeek,
    );

    if (schedules.length === 0) return false;

    const toHHMM = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    const startHHMM = toHHMM(startTime);
    const endHHMM = toHHMM(endTime);

    // rezervimi duhet te bjere PLOTESISHT brenda nje window-i te vetem te orarit
    return schedules.some((s) => startHHMM >= s.startTime && endHHMM <= s.endTime);
  }

  private computeEndTime(startTime: Date, service: { pricingUnit: ServicePricingUnit; duration: number | null }): Date {
    if (service.pricingUnit === ServicePricingUnit.FIXED && service.duration) {
      return new Date(startTime.getTime() + service.duration * 60_000);
    }

    
    throw new AppException(
      ReservationErrorCode.DURATION_REQUIRED,
      { field: "endTime" },
      HttpStatus.BAD_REQUEST,
    );
  }
}