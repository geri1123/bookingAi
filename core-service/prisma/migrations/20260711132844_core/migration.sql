-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'DELETED');

-- CreateEnum
CREATE TYPE "business_type" AS ENUM ('RESTAURANT', 'DENTIST', 'CLINIC', 'HOTEL', 'SALON', 'BARBERSHOP', 'SPA', 'GYM', 'BEAUTY_CLINIC', 'VETERINARY', 'CAR_WASH', 'OTHER');

-- CreateEnum
CREATE TYPE "business_language" AS ENUM ('AL', 'EN', 'IT');

-- CreateEnum
CREATE TYPE "business_status" AS ENUM ('ACTIVE', 'PENDING_SETUP', 'SUSPENDED', 'CLOSED');

-- CreateEnum
CREATE TYPE "business_member_role" AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- CreateEnum
CREATE TYPE "reservation_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "resource_type" AS ENUM ('TABLE', 'ROOM', 'CHAIR', 'OTHER');

-- CreateEnum
CREATE TYPE "invite_status" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "token_type" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'EMAIL_CHANGE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "user_status" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "email_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "token_type" NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "business_type" NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "language" "business_language" NOT NULL,
    "status" "business_status" NOT NULL DEFAULT 'PENDING_SETUP',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "role" "business_member_role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "resource_type" NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "resource_id" TEXT,
    "employee_id" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "reservation_status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "business_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "business_member_role" NOT NULL,
    "token" TEXT NOT NULL,
    "status" "invite_status" NOT NULL DEFAULT 'PENDING',
    "invited_by" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_status" ON "users"("status");

-- CreateIndex
CREATE INDEX "idx_users_created_at" ON "users"("created_at");

-- CreateIndex
CREATE INDEX "idx_users_last_login" ON "users"("last_login_at");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE INDEX "idx_verification_tokens_user_id" ON "verification_tokens"("user_id");

-- CreateIndex
CREATE INDEX "idx_verification_tokens_token" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_phone_key" ON "businesses"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_email_key" ON "businesses"("email");

-- CreateIndex
CREATE INDEX "idx_businesses_type" ON "businesses"("type");

-- CreateIndex
CREATE INDEX "idx_businesses_status" ON "businesses"("status");

-- CreateIndex
CREATE INDEX "idx_businesses_created_at" ON "businesses"("created_at");

-- CreateIndex
CREATE INDEX "idx_businesses_type_status" ON "businesses"("type", "status");

-- CreateIndex
CREATE INDEX "idx_business_members_user_id" ON "business_members"("user_id");

-- CreateIndex
CREATE INDEX "idx_business_members_business_id" ON "business_members"("business_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_business_members_user_business_unique" ON "business_members"("user_id", "business_id");

-- CreateIndex
CREATE INDEX "idx_services_business_id" ON "services"("business_id");

-- CreateIndex
CREATE INDEX "idx_resources_business_id" ON "resources"("business_id");

-- CreateIndex
CREATE INDEX "idx_resources_type" ON "resources"("type");

-- CreateIndex
CREATE INDEX "idx_employees_business_id" ON "employees"("business_id");

-- CreateIndex
CREATE INDEX "idx_schedules_employee_id" ON "schedules"("employee_id");

-- CreateIndex
CREATE INDEX "idx_customers_business_id" ON "customers"("business_id");

-- CreateIndex
CREATE INDEX "idx_customers_phone" ON "customers"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "idx_customers_business_phone_unique" ON "customers"("business_id", "phone");

-- CreateIndex
CREATE INDEX "idx_reservations_business_id" ON "reservations"("business_id");

-- CreateIndex
CREATE INDEX "idx_reservations_customer_id" ON "reservations"("customer_id");

-- CreateIndex
CREATE INDEX "idx_reservations_start_time" ON "reservations"("start_time");

-- CreateIndex
CREATE INDEX "idx_reservations_status" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "idx_reservations_business_start_time" ON "reservations"("business_id", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_key" ON "invites"("token");

-- CreateIndex
CREATE INDEX "idx_invites_business_id" ON "invites"("business_id");

-- CreateIndex
CREATE INDEX "idx_invites_email" ON "invites"("email");

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_members" ADD CONSTRAINT "business_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_members" ADD CONSTRAINT "business_members_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
