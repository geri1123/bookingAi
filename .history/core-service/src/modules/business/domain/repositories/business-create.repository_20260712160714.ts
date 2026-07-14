export abstract class BusinessCreateRepository {
  abstract create(business: BusinessEntity, tx?: Prisma.TransactionClient): Promise<BusinessEntity>;
}