import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { ResourceFindRepository } from "../../../domain/repositories/resource-find.repository";
import { ResourceEntity } from "../../../domain/entities/resource.entity";
import { ResourceMapper } from "../mappers/resource.mapper";
import { Prisma } from "@prisma/client";
import { TransactionContext } from "../../../../../common/domain/transaction-context";

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

    async findFirstAvailable(
    businessId: string,
    startTime: Date,
    endTime: Date,
    minCapacity: number | undefined,
    tx?: TransactionContext,
  ): Promise<ResourceEntity | null> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
 
    // 1 QUERY total: Postgres filtron capacity + kontrollon "NOT EXISTS
    // rezervim qe perputhet", DHE zgjedh 1 rastesisht (ORDER BY random(),
    // per shperndarje te barabarte, njesoj si shuffle() qe perdornim me pare).
    // Zero loop JS, zero N query sekuenciale — funksionon njelloj shpejte
    // qofte biznesi me 5 resources apo 500.
    const rows = await client.$queryRaw<
      { id: string; businessId: string; name: string; type: string; capacity: number }[]
    >`
      SELECT r.id, r.business_id AS "businessId", r.name, r.type, r.capacity
      FROM resources r
      WHERE r.business_id = ${businessId}
        ${minCapacity ? Prisma.sql`AND r.capacity >= ${minCapacity}` : Prisma.empty}
        AND NOT EXISTS (
          SELECT 1 FROM reservations res
          WHERE res.resource_id = r.id
            AND res.status != 'CANCELLED'
            AND res.start_time < ${endTime}
            AND res.end_time > ${startTime}
        )
      ORDER BY random()
      LIMIT 1
    `;
 
    if (rows.length === 0) return null;
 
    return ResourceMapper.toDomain(rows[0] as unknown as Parameters<typeof ResourceMapper.toDomain>[0]);
  }
}
