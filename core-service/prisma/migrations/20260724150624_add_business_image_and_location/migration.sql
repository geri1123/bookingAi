-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "profile_image_public_id" TEXT,
ADD COLUMN     "profile_image_url" TEXT;
