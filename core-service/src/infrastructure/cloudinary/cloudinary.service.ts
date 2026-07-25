import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { AppConfigService } from '../../config/config.service';
import { AppException } from '../../common/exceptions/app.exception';
import { CloudinaryErrorCode } from './errors/cloudinary-error-codes.enum';
import { CloudinaryUploadResult } from './types/cloudinary-upload.result';


export interface UploadedFileLike {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

@Injectable()
export class CloudinaryService implements OnModuleInit {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly config: AppConfigService) {}

  onModuleInit() {
    
    this.config.cloudinaryUrl;
    this.logger.log('Cloudinary configured successfully');
  }

  async uploadFile(
    file: UploadedFileLike,
    folder: string,
  ): Promise<CloudinaryUploadResult> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new AppException(
        CloudinaryErrorCode.INVALID_FILE_TYPE,
        { field: 'file', mimetype: file.mimetype },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (file.size > MAX_BYTES) {
      throw new AppException(
        CloudinaryErrorCode.FILE_TOO_LARGE,
        { field: 'file', maxBytes: MAX_BYTES },
        HttpStatus.BAD_REQUEST,
      );
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error(`Failed to upload to Cloudinary: ${error?.message}`, error);
            return reject(
              new AppException(
                CloudinaryErrorCode.UPLOAD_FAILED,
                { field: 'file' },
                HttpStatus.BAD_GATEWAY,
              ),
            );
          }

          this.logger.log(`Successfully uploaded to Cloudinary: ${result.public_id}`);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Deleted Cloudinary image: ${publicId}, result: ${result.result}`);
    } catch (error) {
      this.logger.error(`Failed to delete Cloudinary image: ${publicId}`, error);
      throw new AppException(
        CloudinaryErrorCode.DELETE_FAILED,
        { field: 'publicId', publicId },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}