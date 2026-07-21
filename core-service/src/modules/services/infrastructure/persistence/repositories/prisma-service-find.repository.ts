import { Injectable } from "@nestjs/common";
import { PrismaService as PrismaClient } from "../../../../../infrastructure/prisma/prisma.service";
import { ServiceFindRepository } from "../../../domain/repositories/service-find.repository";
import { ServiceEntity } from "../../../domain/entities/service.entity";
import { ServiceMapper } from "../mappers/service.mapper";

@Injectable()
export class PrismaServiceFindRepository implements ServiceFindRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<ServiceEntity | null> {
    const raw = await this.prisma.service.findUnique({ where: { id } });
    return raw ? ServiceMapper.toDomain(raw) : null;
  }

  async findAllByBusiness(businessId: string): Promise<ServiceEntity[]> {
    const rows = await this.prisma.service.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    });
    return rows.map(ServiceMapper.toDomain);
  }
  async countByBusiness(businessId: string): Promise<number> {
  return this.prisma.service.count({ where: { businessId } });
}
}