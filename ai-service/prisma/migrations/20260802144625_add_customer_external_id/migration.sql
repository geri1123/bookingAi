/*
  Warnings:

  - You are about to drop the column `customer_phone` on the `conversations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[business_id,customer_external_id,channel]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_external_id` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "CommunicationChannel" ADD VALUE 'MESSENGER';
ALTER TYPE "CommunicationChannel" ADD VALUE 'INSTAGRAM';

-- DropIndex
DROP INDEX "conversations_business_id_customer_phone_key";

-- DropIndex
DROP INDEX "conversations_customer_phone_idx";

-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "customer_phone",
ADD COLUMN     "customer_external_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "conversations_customer_external_id_idx" ON "conversations"("customer_external_id");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_business_id_customer_external_id_channel_key" ON "conversations"("business_id", "customer_external_id", "channel");
