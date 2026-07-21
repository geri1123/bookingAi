import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessFindRepository } from "../../../domain/repositories/business-find.repository";
import { BusinessEntity } from "../../../domain/entities/business.entity";
import { BusinessMapper } from "../mappers/business.mapper";
 
@Injectable()
export class PrismaBusinessFindRepository implements BusinessFindRepository {
  constructor(private readonly prisma: PrismaService) {}
 
  async findById(id: string): Promise<BusinessEntity | null> {
    const raw = await this.prisma.business.findUnique({ where: { id } });
    return raw ? BusinessMapper.toDomain(raw) : null;
  }
    async findStalePendingSetup(olderThan: Date):Promise<BusinessEntity[]>{
       const rows = await this.prisma.business.findMany({
      where: { status: "PENDING_SETUP", createdAt: { lt: olderThan }, setupReminderSentAt: null },
    });
    return rows.map(BusinessMapper.toDomain);
  }  

    
}
 