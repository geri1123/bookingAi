import { BusinessEntity } from "../entities/business.entity";

export abstract class BusinessCreateRepository {
  abstract create(business: BusinessEntity, tx?: Prisma.TransactionClient): Promise<BusinessEntity>;
}