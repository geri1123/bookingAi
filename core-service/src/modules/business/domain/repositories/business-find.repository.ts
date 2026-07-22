import { BusinessEntity } from "../entities/business.entity";
 
export abstract class BusinessFindRepository {
  abstract findById(id: string): Promise<BusinessEntity | null>;
 
  
  abstract findStalePendingSetupPage(
    olderThan: Date,
    take: number,
    cursorId?: string,
  ): Promise<BusinessEntity[]>;
}
 