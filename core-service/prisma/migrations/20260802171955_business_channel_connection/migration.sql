-- CreateEnum
CREATE TYPE "channel_type" AS ENUM ('WHATSAPP', 'MESSENGER', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "channel_connection_status" AS ENUM ('CONNECTED', 'DISCONNECTED');

-- CreateTable
CREATE TABLE "business_channel_connections" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "channel" "channel_type" NOT NULL,
    "external_account_id" TEXT NOT NULL,
    "access_token_encrypted" TEXT NOT NULL,
    "status" "channel_connection_status" NOT NULL DEFAULT 'CONNECTED',
    "ai_enabled" BOOLEAN NOT NULL DEFAULT true,
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "disconnected_at" TIMESTAMP(3),

    CONSTRAINT "business_channel_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_channel_conn_business_id" ON "business_channel_connections"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_channel_conn_business_channel_unique" ON "business_channel_connections"("business_id", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "idx_channel_conn_external_account_unique" ON "business_channel_connections"("channel", "external_account_id");

-- AddForeignKey
ALTER TABLE "business_channel_connections" ADD CONSTRAINT "business_channel_connections_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
