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

import { ServiceEntity, ServicePricingUnit } from "../../../services/domain/entities/service.entity";
import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";

import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { EmployeeErrorCode } from "../../../employees/domain/errors/employee-error-codes.enum";

import { ResourceFindRepository } from "../../../resources/domain/repositories/resource-find.repository";
import { ResourceErrorCode } from "../../../resources/domain/errors/resource-error-codes.enum";

import { BusinessFindRepository } from "../../../business/domain/repositories/business-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";

import { WorkingHoursCheckerService } from "../services/working-hours-checker.service";
import { EmployeeAutoAssignService } from "../services/employee-auto-assign.service";
import { ResourceAutoAssignService } from "../services/resource-auto-assign.service";

export interface CreateReservationInput {
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  // OPSIONALE — nese biznesi ka VETEM 1 service, zgjidhet automatikisht.
  // Nese ka 2+, DUHET dhene eksplicit (app-i/AI duhet te dijne cilin do klienti).
  serviceId?: string;
  employeeId?: string;
  resourceId?: string;
  partySize?: number;
  startTime: Date;
  endTime?: Date;
}

const MAX_ACTIVE_RESERVATIONS_PER_CUSTOMER = 3;

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
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly outboxWriter: OutboxEventWriter,
    private readonly workingHoursChecker: WorkingHoursCheckerService,
    private readonly employeeAutoAssign: EmployeeAutoAssignService,
    private readonly resourceAutoAssign: ResourceAutoAssignService,
  ) {}

  async execute(input: CreateReservationInput): Promise<ReservationEntity> {
    const service = await this.resolveService(input.businessId, input.serviceId);

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
      const withinWorkingHours = await this.workingHoursChecker.isWithinWorkingHours(
        input.employeeId,
        input.startTime,
        endTime,
      );
      if (!withinWorkingHours) {
        throw new AppException(ReservationErrorCode.OUTSIDE_WORKING_HOURS, { field: "startTime" }, HttpStatus.CONFLICT);
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
        resolvedEmployeeId = await this.employeeAutoAssign.assign(input.businessId, input.startTime, endTime, tx);
      } else if (autoAssignMode === "RESOURCE") {
        resolvedResourceId = await this.resourceAutoAssign.assign(
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

      const activeCount = await this.reservationFindRepo.countActiveByCustomer(customer.id, input.businessId, tx);
      if (activeCount >= MAX_ACTIVE_RESERVATIONS_PER_CUSTOMER) {
        throw new AppException(
          ReservationErrorCode.TOO_MANY_ACTIVE_RESERVATIONS,
          { field: "phone", max: MAX_ACTIVE_RESERVATIONS_PER_CUSTOMER },
          HttpStatus.CONFLICT,
        );
      }

      const entity = ReservationEntity.create({
        businessId: input.businessId,
        customerId: customer.id,
        serviceId: service.id,
        employeeId: resolvedEmployeeId,
        resourceId: resolvedResourceId,
        partySize: input.partySize ?? null,
        startTime: input.startTime,
        endTime,
      });

      const created = await this.reservationCreateRepo.create(entity, tx);

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


  private async resolveService(businessId: string, serviceId: string | undefined): Promise<ServiceEntity> {
    if (serviceId) {
      const service = await this.serviceFindRepo.findById(serviceId);
      if (!service || service.businessId !== businessId) {
        throw new AppException(ReservationErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
      }
      return service;
    }

    const allServices = await this.serviceFindRepo.findAllByBusiness(businessId);

    if (allServices.length === 0) {
      throw new AppException(ReservationErrorCode.SERVICE_NOT_FOUND, { field: "serviceId" }, HttpStatus.NOT_FOUND);
    }

    if (allServices.length > 1) {
      throw new AppException(
        ReservationErrorCode.SERVICE_SELECTION_REQUIRED,
        { field: "serviceId", availableCount: allServices.length },
        HttpStatus.BAD_REQUEST,
      );
    }

    return allServices[0];
  }

  private computeEndTime(startTime: Date, service: { pricingUnit: ServicePricingUnit; duration: number | null }): Date {
    if (service.pricingUnit === ServicePricingUnit.FIXED && service.duration) {
      return new Date(startTime.getTime() + service.duration * 60_000);
    }
    throw new AppException(ReservationErrorCode.DURATION_REQUIRED, { field: "endTime" }, HttpStatus.BAD_REQUEST);
  }
}