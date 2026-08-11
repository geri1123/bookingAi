-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "service_id" TEXT;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
