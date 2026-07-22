import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ResourceFindRepository } from "../../../domain/repositories/resource-find.repository";
import { ResourceEntity } from "../../../domain/entities/resource.entity";
import { ResourceMapper } from "../mappers/resource.mapper";

@Injectable()
export class PrismaResourceFindRepository implements ResourceFindRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ResourceEntity | null> {
    const raw = await this.prisma.resource.findUnique({ where: { id } });
    return raw ? ResourceMapper.toDomain(raw) : null;
  }

  async findAllByBusiness(businessId: string): Promise<ResourceEntity[]> {
    const rows = await this.prisma.resource.findMany({
      where: { businessId },
      orderBy: { name: "asc" },
    });
    return rows.map(ResourceMapper.toDomain);
  }

  async countByBusiness(businessId: string): Promise<number> {
    return this.prisma.resource.count({ where: { businessId } });
  }
}
