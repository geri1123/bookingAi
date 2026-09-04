import { Injectable, HttpStatus } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../../../infrastructure/prisma/prisma.service";
import { BusinessCreateRepository } from "../../../domain/repositories/business-create.repository";
import { BusinessEntity } from "../../../domain/entities/business.entity";
import { BusinessMapper } from "../mappers/business.mapper";
import { AppException } from "../../../../../common/exceptions/app.exception";
import { BusinessErrorCode } from "../../../domain/errors/business-error-codes.enum";
import { TransactionContext } from "../../../../../common/domain/transaction-context";
import { extractDuplicateFieldNames } from "../../../../../common/helpers/extract-duplicate-field-names.helper";




@Injectable()
export class PrismaBusinessCreateRepository implements BusinessCreateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(business: BusinessEntity, tx?: TransactionContext): Promise<BusinessEntity> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;

    try {
      const data = BusinessMapper.toPersistence(business);
      const created = await client.business.create({ data });
      return BusinessMapper.toDomain(created);
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