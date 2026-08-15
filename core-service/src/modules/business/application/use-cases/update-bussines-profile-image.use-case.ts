import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/prisma/prisma.service";
import { BusinessFindRepository } from "../../domain/repositories/business-find.repository";
import { BusinessUpdateRepository } from "../../domain/repositories/business-update.repositoy";
import { BusinessErrorCode } from "../../domain/errors/business-error-codes.enum";
import { AppException } from "../../../../common/exceptions/app.exception";
import { OutboxEventWriter } from "../../../../common/events/outbox-event-writer";
import { EventName } from "../../../../common/events/event-name.enum";
import { CloudinaryService, UploadedFileLike } from "../../../../infrastructure/cloudinary/cloudinary.service";
import { BusinessCacheService } from "../../infrastructure/persistence/cache/business-cache.service";
export interface UpdateBusinessProfileImageInput {
  businessId: string;
  file: UploadedFileLike;
}

export interface UpdateBusinessProfileImageOutput {
  profileImageUrl: string;
}

@Injectable()
export class UpdateBusinessProfileImageUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly businessFindRepo: BusinessFindRepository,
    private readonly businessUpdateRepo: BusinessUpdateRepository,
    private readonly cloudinary: CloudinaryService,
    private readonly outboxWriter: OutboxEventWriter,
      private readonly businessCache: BusinessCacheService,
  ) {}

  async execute(input: UpdateBusinessProfileImageInput): Promise<UpdateBusinessProfileImageOutput> {
    const business = await this.businessFindRepo.findById(input.businessId);
    if (!business) {
      throw new AppException(BusinessErrorCode.NOT_FOUND, { businessId: input.businessId }, HttpStatus.NOT_FOUND);
    }

    const previousPublicId = business.profileImagePublicId;

    const uploadResult = await this.cloudinary.uploadFile(input.file, `businesses/${business.id}/profile`);

    business.updateProfileImage(uploadResult.url, uploadResult.publicId);

    await this.prisma.$transaction(async (tx) => {
      await this.businessUpdateRepo.update(business, tx);

      await this.outboxWriter.write(
        EventName.BUSINESS_PROFILE_IMAGE_UPDATED,
        business.id,
        {
          businessId: business.id,
          profileImageUrl: uploadResult.url,
        },
        tx,
      );
    });
await this.businessCache.invalidate(business.id);
    // Fshi imazhin e vjeter nga Cloudinary VETEM pasi ndryshimi eshte ruajtur
    // me sukses ne DB, per te shmangur humbjen e imazhit nese transaction-i deshton.
    if (previousPublicId) {
      try {
        await this.cloudinary.deleteFile(previousPublicId);
      } catch {
       
      }
    }

    return { profileImageUrl: uploadResult.url };
  }
}