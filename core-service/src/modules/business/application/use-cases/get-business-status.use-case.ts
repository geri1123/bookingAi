import { Injectable, NotFoundException } from "@nestjs/common";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";
import { ResourceFindRepository } from "../../../resources/domain/repositories/resource-find.repository";
import { EmployeeFindRepository } from "../../../employees/domain/repositories/employee-find.repository";
import { ScheduleFindRepository } from "../../../schedules/domain/repositories/schedule-find.repository";
import { ACTIVATION_REQUIREMENTS } from "../../../business-activation/domain/business-activation-requirements";

export interface CompletedSteps {
  photo: boolean;
  location: boolean;
  services: boolean;
  resources: boolean;
  employees: boolean;
}

export interface GetBusinessStatusOutput {
  businessId: string;
  status: string;
  type: string;
  completedSteps: CompletedSteps;
}

@Injectable()
export class GetBusinessStatusUseCase {
  constructor(
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
    private readonly resourceFindRepo: ResourceFindRepository,
    private readonly employeeFindRepo: EmployeeFindRepository,
    private readonly scheduleFindRepo: ScheduleFindRepository,
  ) {}

  async execute(businessId: string): Promise<GetBusinessStatusOutput> {
    const business = await this.businessFindRepo.findById(businessId);
    if (!business) {
      throw new NotFoundException("Business not found");
    }

    const req = ACTIVATION_REQUIREMENTS[business.type];

    const [serviceCount, resourceCount, employeeCount, scheduleCount] = await Promise.all([
      req.needsService ? this.serviceFindRepo.countByBusiness(businessId) : Promise.resolve(1),
      req.needsResource ? this.resourceFindRepo.countByBusiness(businessId) : Promise.resolve(1),
      req.needsEmployee ? this.employeeFindRepo.countByBusiness(businessId) : Promise.resolve(1),
      req.needsEmployee ? this.scheduleFindRepo.countByBusiness(businessId) : Promise.resolve(1),
    ]);

    return {
      businessId: business.id,
      status: business.status,
      type: business.type,
      completedSteps: {
        photo: business.profileImageUrl !== null,
        location: business.latitude !== null && business.longitude !== null,
        services: serviceCount > 0,
        resources: resourceCount > 0,
        employees: employeeCount > 0 && scheduleCount > 0,
      },
    };
  }
}