import { ServiceEntity } from "../entities/service.entity";

export abstract class ServiceFindRepository {
  abstract findById(id: string): Promise<ServiceEntity | null>;
  abstract findAllByBusiness(businessId: string): Promise<ServiceEntity[]>;
  abstract countByBusiness(businessId: string): Promise<number>;  
}