import { Injectable, Logger } from "@nestjs/common";
import { CommunicationChannel } from "../../domain/repositories/conversation.repository";
import { BookingIntentRepository } from "../../domain/repositories/booking-intent.repository";
import { CoreServiceClient, CoreServiceError } from "../../infrastructure/http/core-service.client";

export interface ToolExecutionContext {
  businessId: string;
  customerExternalId: string;
  channel: CommunicationChannel;
  text: string;
}

@Injectable()
export class ToolExecutorService {
  private readonly logger = new Logger(ToolExecutorService.name);

  constructor(
    private readonly coreServiceClient: CoreServiceClient,
    private readonly bookingIntentRepo: BookingIntentRepository,
  ) {}

  async execute(
    name: string,
    toolInput: Record<string, unknown>,
    input: ToolExecutionContext,
    conversationId: string,
  ): Promise<string> {
    try {
      if (name === "check_availability") {
        const result = await this.coreServiceClient.checkAvailability({
          businessId: input.businessId,
          date: toolInput.date as string,
          serviceId: toolInput.serviceId as string | undefined,
          employeeId: toolInput.employeeId as string | undefined,
        });
        return JSON.stringify(result);
      }

      if (name === "check_resource_availability") {
        const result = await this.coreServiceClient.checkResourceAvailability({
          businessId: input.businessId,
          startTime: toolInput.startTime as string,
          endTime: toolInput.endTime as string,
          partySize: toolInput.partySize as number | undefined,
        });
        return JSON.stringify(result);
      }

      if (name === "create_reservation") {
      
        const fallbackPhone = input.channel === "WHATSAPP" ? input.customerExternalId : undefined;
        const phone = (toolInput.phone as string | undefined) ?? fallbackPhone;

        if (!phone) {
          return JSON.stringify({
            success: false,
            error: "Numri i telefonit i klientit mungon — kerkoji klientit ta japi para se te rezervosh.",
          });
        }

        const intent = await this.bookingIntentRepo.createOrUpdate(conversationId, input.businessId, {
          name: toolInput.name as string,
          phone,
          serviceId: toolInput.serviceId as string | undefined,
          employeeId: toolInput.employeeId as string | undefined,
          resourceId: toolInput.resourceId as string | undefined,
          partySize: toolInput.partySize as number | undefined,
          startTime: toolInput.startTime as string,
          endTime: toolInput.endTime as string | undefined,
        });

        try {
          const reservation = await this.coreServiceClient.createReservation({
            businessId: input.businessId,
            name: toolInput.name as string,
            phone,
            serviceId: toolInput.serviceId as string | undefined,
            employeeId: toolInput.employeeId as string | undefined,
            resourceId: toolInput.resourceId as string | undefined,
            partySize: toolInput.partySize as number | undefined,
            startTime: toolInput.startTime as string,
            endTime: toolInput.endTime as string | undefined,
          });

          const reservationId = reservation?.reservation?.id;
          if (reservationId) {
            await this.bookingIntentRepo.markConfirmed(intent.id, reservationId);
          }
          return JSON.stringify({ success: true, reservation: reservation?.reservation });
        } catch (err) {
          const message = err instanceof CoreServiceError ? JSON.stringify(err.body) : String(err);
          await this.bookingIntentRepo.markFailed(intent.id, message);
          return JSON.stringify({ success: false, error: message });
        }
      }

      if (name === "find_customer_reservations") {
        const phone = (toolInput.phone as string | undefined) ?? (input.channel === "WHATSAPP" ? input.customerExternalId : undefined);
        if (!phone) {
          return JSON.stringify({ success: false, error: "Numri i telefonit mungon." });
        }
        const result = await this.coreServiceClient.findCustomerReservations({
          businessId: input.businessId,
          phone,
        });
        return JSON.stringify(result);
      }

      if (name === "reschedule_reservation") {
        const phone = (toolInput.phone as string | undefined) ?? (input.channel === "WHATSAPP" ? input.customerExternalId : undefined);
        if (!phone) {
          return JSON.stringify({ success: false, error: "Numri i telefonit mungon — kerkoji klientit ta japi." });
        }
        try {
          const result = await this.coreServiceClient.rescheduleReservation({
            businessId: input.businessId,
            reservationId: toolInput.reservationId as string,
            phone,
            startTime: toolInput.startTime as string,
            endTime: toolInput.endTime as string | undefined,
          });
          return JSON.stringify({ success: true, reservation: result?.reservation });
        } catch (err) {
          const message = err instanceof CoreServiceError ? JSON.stringify(err.body) : String(err);
          return JSON.stringify({ success: false, error: message });
        }
      }

      if (name === "cancel_reservation") {
        const phone = (toolInput.phone as string | undefined) ?? (input.channel === "WHATSAPP" ? input.customerExternalId : undefined);
        if (!phone) {
          return JSON.stringify({ success: false, error: "Numri i telefonit mungon — kerkoji klientit ta japi." });
        }
        try {
          const result = await this.coreServiceClient.cancelReservation({
            businessId: input.businessId,
            reservationId: toolInput.reservationId as string,
            phone,
          });
          return JSON.stringify({ success: true, reservation: result?.reservation });
        } catch (err) {
          const message = err instanceof CoreServiceError ? JSON.stringify(err.body) : String(err);
          return JSON.stringify({ success: false, error: message });
        }
      }

      return JSON.stringify({ success: false, error: `Vegel e panjohur: ${name}` });
    } catch (err) {
      this.logger.error(`Gabim gjate ekzekutimit te vegles ${name}: ${err instanceof Error ? err.message : err}`);
      return JSON.stringify({ success: false, error: "Gabim i papritur." });
    }
  }
}