import { Injectable, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessCreateRepository } from "../../../domain/repositories/business-create.repository";
import { BusinessEntity } from "../../../domain/entities/business.entity";
import { BusinessMapper } from "../mappers/business.mapper";
import { AppException } from "../../../../../common/exceptions/app.exception";
import { BusinessErrorCode } from "../../../domain/errors/business-error-codes.enum";

@Injectable()
export class PrismaBusinessCreateRepository implements BusinessCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(business: BusinessEntity, tx?: Prisma.TransactionClient): Promise<BusinessEntity> {
    const client = tx ?? this.prisma;

    try {
      const data = BusinessMapper.toPersistence(business);
      const created = await client.business.create({ data });
      return BusinessMapper.toDomain(created);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined)?.join(", ") ?? "field";
        const isEmail = target.includes("email");

        throw new AppException(
          isEmail ? BusinessErrorCode.EMAIL_ALREADY_IN_USE : BusinessErrorCode.PHONE_ALREADY_IN_USE,
          { field: isEmail ? "email" : "phone" },
          HttpStatus.CONFLICT,
        );
      }
      throw err;
    }
  }
}