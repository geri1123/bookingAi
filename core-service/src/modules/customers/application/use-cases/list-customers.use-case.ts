import { Injectable } from "@nestjs/common";
import { CustomerEntity } from "../../domain/entities/customer.entity";
import { CustomerFindRepository } from "../../domain/repositories/customer-find.repository";

export interface ListCustomersInput {
  businessId: string;
  offset?: number;
}

export interface ListCustomersResult {
  customers: CustomerEntity[];
  total: number;
}

// Fiks ne backend — s'i lihet frontend-it ta zgjedhe, per te evituar qe dikush
// te kerkoje limit=100000 dhe te mbingarkoje DB-ne/response-in.
const PAGE_SIZE = 20;

@Injectable()
export class ListCustomersUseCase {
  constructor(private readonly customerFindRepo: CustomerFindRepository) {}

  async execute(input: ListCustomersInput): Promise<ListCustomersResult> {
    const offset = Math.max(input.offset ?? 0, 0);

    const { customers, total } = await this.customerFindRepo.findAllByBusiness(
      input.businessId,
      PAGE_SIZE,
      offset,
    );

    return { customers, total };
  }
}