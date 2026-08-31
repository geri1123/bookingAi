-- AlterEnum
ALTER TYPE "service_pricing_unit" ADD VALUE 'VARIABLE';

-- AlterTable
ALTER TABLE "services" ALTER COLUMN "price" DROP NOT NULL;
