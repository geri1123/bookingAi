import { Injectable } from "@nestjs/common";
import { ReservationEntity } from "../../domain/entities/reservation.entity";
import { ReservationFindRepository } from "../../domain/repositories/reservation-find.repository";
import { CustomerFindRepository } from "../../../customers/domain/repositories/customer-find.repository";
import { ServiceFindRepository } from "../../../services/domain/repositories/service-find.repository";

export interface FindCustomerReservationsInput {
  businessId: string;
  phone: string;
}

// Perfaqesim i thjeshtuar, gati per t'i shfaqur AI-t (dhe permes saj klientit) —
// perfshin serviceName ne vend te vetem serviceId, per te qene i kuptueshem direkt.
export interface CustomerReservationSummary {
  id: string;
  serviceName: string | null;
  startTime: Date;
  endTime: Date;
  status: string;
}

@Injectable()
export class FindCustomerReservationsUseCase {
  constructor(
    private readonly customerFindRepo: CustomerFindRepository,
    private readonly reservationFindRepo: ReservationFindRepository,
    private readonly serviceFindRepo: ServiceFindRepository,
  ) {}

  async execute(input: FindCustomerReservationsInput): Promise<CustomerReservationSummary[]> {
    const customer = await this.customerFindRepo.findByPhone(input.businessId, input.phone);
    if (!customer) {
      return [];
    }

    const reservations = await this.reservationFindRepo.findActiveByCustomer(customer.id, input.businessId);

    return Promise.all(
      reservations.map(async (r: ReservationEntity) => {
        const service = r.serviceId ? await this.serviceFindRepo.findById(r.serviceId) : null;
        return {
          id: r.id,
          serviceName: service?.name ?? null,
          startTime: r.startTime,
          endTime: r.endTime,
          status: r.status,
        };
      }),
    );
  }
}
