-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('WHATSAPP', 'VOICE');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('ACTIVE', 'AWAITING_CONFIRMATION', 'CLOSED');

-- CreateEnum
CREATE TYPE "BookingIntentStatus" AS ENUM ('COLLECTING', 'CONFIRMED', 'FAILED');

-- CreateTable
CREATE TABLE "ai_settings" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "system_prompt" TEXT,
    "language" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "messages" JSONB NOT NULL DEFAULT '[]',
    "handed_off" BOOLEAN NOT NULL DEFAULT false,
    "last_message_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_intents" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "status" "BookingIntentStatus" NOT NULL DEFAULT 'COLLECTING',
    "payload" JSONB NOT NULL DEFAULT '{}',
    "reservation_id" TEXT,
    "failure_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_intents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ai_settings_business_id_key" ON "ai_settings"("business_id");

-- CreateIndex
CREATE INDEX "conversations_business_id_idx" ON "conversations"("business_id");

-- CreateIndex
CREATE INDEX "conversations_customer_phone_idx" ON "conversations"("customer_phone");

-- CreateIndex
CREATE INDEX "conversations_last_message_at_idx" ON "conversations"("last_message_at");

-- CreateIndex
CREATE UNIQUE INDEX "conversations_business_id_customer_phone_key" ON "conversations"("business_id", "customer_phone");

-- CreateIndex
CREATE UNIQUE INDEX "booking_intents_reservation_id_key" ON "booking_intents"("reservation_id");

-- CreateIndex
CREATE INDEX "booking_intents_conversation_id_idx" ON "booking_intents"("conversation_id");

-- CreateIndex
CREATE INDEX "booking_intents_business_id_idx" ON "booking_intents"("business_id");

-- AddForeignKey
ALTER TABLE "booking_intents" ADD CONSTRAINT "booking_intents_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
