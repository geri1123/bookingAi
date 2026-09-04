import { Injectable, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessUpdateRepository } from "../../../domain/repositories/business-update.repositoy";
import { BusinessEntity } from "../../../domain/entities/business.entity";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { BusinessMapper } from "../mappers/business.mapper";
import { BusinessCacheService } from "../cache/business-cache.service";
import { AppException } from "../../../../../common/exceptions/app.exception";
import { BusinessErrorCode } from "../../../domain/errors/business-error-codes.enum";
import { extractDuplicateFieldNames } from "../../../../../common/helpers/extract-duplicate-field-names.helper";

@Injectable()
export class PrismaBusinessUpdateRepository implements BusinessUpdateRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: BusinessCacheService,
  ) {}

  async update(business: BusinessEntity, tx?: TransactionContext): Promise<BusinessEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    try {
      const updated = await client.business.update({
        where: { id: business.id },
        data: BusinessMapper.toPersistence(business),
      });

      if (!tx) {
        await this.cache.invalidate(business.id);
      }

      return BusinessMapper.toDomain(updated);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const fields = extractDuplicateFieldNames(err.meta);

        if (fields.includes("email")) {
          throw new AppException(BusinessErrorCode.EMAIL_ALREADY_IN_USE, { field: "email" }, HttpStatus.CONFLICT);
        }
        if (fields.includes("phone")) {
          throw new AppException(BusinessErrorCode.PHONE_ALREADY_IN_USE, { field: "phone" }, HttpStatus.CONFLICT);
        }

        throw new AppException(BusinessErrorCode.DUPLICATE_FIELD, {}, HttpStatus.CONFLICT);
      }
      throw err;
    }
  }
}