import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { EmployeeFindRepository } from "../../../domain/repositories/employee-find.repository";
import { EmployeeEntity } from "../../../domain/entities/employee.entity";
import { EmployeeMapper } from "../mappers/employee.mapper";

@Injectable()
export class PrismaEmployeeFindRepository implements EmployeeFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<EmployeeEntity | null> {
    const raw = await this.prisma.employee.findUnique({ where: { id } });
    return raw ? EmployeeMapper.toDomain(raw) : null;
  }

  async findAllByBusiness(businessId: string): Promise<EmployeeEntity[]> {
    const rows = await this.prisma.employee.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    });
    return rows.map(EmployeeMapper.toDomain);
  }

  async countByBusiness(businessId: string): Promise<number> {
    return this.prisma.employee.count({ where: { businessId } });
  }
}
