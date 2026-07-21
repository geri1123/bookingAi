import { BusinessEntity } from "../entities/business.entity";

export abstract class BusinessFindRepository {
  abstract findById(id: string): Promise<BusinessEntity | null>;
  abstract findStalePendingSetup(olderThan: Date): Promise<BusinessEntity[]>; 
}