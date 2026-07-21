import { Injectable } from "@nestjs/common";
import { EmployeeEntity } from "../../domain/entities/employee.entity";
import { EmployeeCreateRepository } from "../../domain/repositories/employee-create.repository";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";

export interface CreateEmployeeInput {
  businessId: string;
  name: string;
  phone?: string;
}

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    private readonly employeeCreateRepo: EmployeeCreateRepository,
    private readonly outboxWriter: OutboxEventWriter,
  ) {}

  async execute(input: CreateEmployeeInput): Promise<EmployeeEntity> {
    const employee = EmployeeEntity.create(input);
    const created = await this.employeeCreateRepo.create(employee);

    await this.outboxWriter.write(EventName.EMPLOYEE_CREATED, employee.id, {
      businessId: employee.businessId,
      employeeId: employee.id,
    });

    return created;
  }
}
