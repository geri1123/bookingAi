/*
  Warnings:

  - You are about to drop the `outbox_events` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "outbox_status" AS ENUM ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED');

-- DropTable
DROP TABLE "outbox_events";

-- CreateTable
CREATE TABLE "kafka_events" (
    "id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "aggregate_id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "outbox_status" NOT NULL DEFAULT 'PENDING',
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "kafka_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_kafka_events_status" ON "kafka_events"("status");

-- CreateIndex
CREATE INDEX "idx_kafka_events_status_created_at" ON "kafka_events"("status", "created_at");
