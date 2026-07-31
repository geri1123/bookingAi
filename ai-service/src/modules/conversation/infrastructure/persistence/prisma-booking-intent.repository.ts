import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import {
  BookingIntent,
  BookingIntentPayload,
  BookingIntentRepository,
} from "../../domain/repositories/booking-intent.repository";

@Injectable()
export class PrismaBookingIntentRepository extends BookingIntentRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findActiveByConversation(conversationId: string): Promise<BookingIntent | null> {
    const row = await this.prisma.bookingIntent.findFirst({
      where: { conversationId, status: "COLLECTING" },
      orderBy: { createdAt: "desc" },
    });
    return row ? this.toDomain(row) : null;
  }

  async createOrUpdate(
    conversationId: string,
    businessId: string,
    payload: BookingIntentPayload,
  ): Promise<BookingIntent> {
    const existing = await this.findActiveByConversation(conversationId);

    if (existing) {
      const row = await this.prisma.bookingIntent.update({
        where: { id: existing.id },
        data: { payload: { ...existing.payload, ...payload } as any },
      });
      return this.toDomain(row);
    }

    const row = await this.prisma.bookingIntent.create({
      data: { conversationId, businessId, payload: payload as any },
    });
    return this.toDomain(row);
  }

  async markConfirmed(id: string, reservationId: string): Promise<void> {
    await this.prisma.bookingIntent.update({
      where: { id },
      data: { status: "CONFIRMED", reservationId },
    });
  }

  async markFailed(id: string, reason: string): Promise<void> {
    await this.prisma.bookingIntent.update({
      where: { id },
      data: { status: "FAILED", failureReason: reason },
    });
  }

  private toDomain(row: any): BookingIntent {
    return {
      id: row.id,
      conversationId: row.conversationId,
      businessId: row.businessId,
      status: row.status,
      payload: row.payload,
      reservationId: row.reservationId,
    };
  }
}
