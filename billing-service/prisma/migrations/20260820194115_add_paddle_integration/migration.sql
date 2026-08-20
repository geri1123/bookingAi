/*
  Warnings:

  - A unique constraint covering the columns `[paddle_price_id]` on the table `plans` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "paddle_price_id" TEXT;

-- CreateTable
CREATE TABLE "paddle_webhook_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paddle_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_paddle_price_id_key" ON "plans"("paddle_price_id");
