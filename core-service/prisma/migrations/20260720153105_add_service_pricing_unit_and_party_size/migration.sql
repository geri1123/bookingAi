-- CreateEnum
CREATE TYPE "service_pricing_unit" AS ENUM ('FIXED', 'PER_NIGHT', 'PER_HOUR');

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "party_size" INTEGER;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "pricing_unit" "service_pricing_unit" NOT NULL DEFAULT 'FIXED',
ALTER COLUMN "duration" DROP NOT NULL;
