-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('WHATSAPP', 'MESSENGER', 'INSTAGRAM');

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "phone" TEXT,
    "external_id" TEXT,
    "content" TEXT NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "provider_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "messages_business_id_idx" ON "messages"("business_id");

-- CreateIndex
CREATE INDEX "messages_phone_idx" ON "messages"("phone");

-- CreateIndex
CREATE INDEX "messages_external_id_idx" ON "messages"("external_id");

-- CreateIndex
CREATE INDEX "messages_created_at_idx" ON "messages"("created_at");
