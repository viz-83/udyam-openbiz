-- CreateEnum
CREATE TYPE "public"."OrgType" AS ENUM ('proprietorship', 'partnership', 'pvtltd', 'publicltd');

-- CreateEnum
CREATE TYPE "public"."SocialCategory" AS ENUM ('gen', 'sc', 'st', 'obc');

-- CreateEnum
CREATE TYPE "public"."MajorActivity" AS ENUM ('manufacturing', 'service');

-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" SERIAL NOT NULL,
    "aadhaarKey" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UdyamApplication" (
    "id" SERIAL NOT NULL,
    "aadhaarKey" TEXT NOT NULL,
    "aadhaarLast4" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "pan" VARCHAR(10),
    "enterpriseName" TEXT,
    "orgType" "public"."OrgType",
    "incorpDate" TIMESTAMP(3),
    "hasGstin" BOOLEAN,
    "gstin" VARCHAR(15),
    "socialCategory" "public"."SocialCategory",
    "physicallyDisabled" BOOLEAN,
    "authorisedName" TEXT,
    "mobile" VARCHAR(10),
    "email" TEXT,
    "nic2Digit" VARCHAR(2),
    "majorActivity" "public"."MajorActivity",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),

    CONSTRAINT "UdyamApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Otp_aadhaarKey_idx" ON "public"."Otp"("aadhaarKey");

-- CreateIndex
CREATE INDEX "UdyamApplication_aadhaarKey_idx" ON "public"."UdyamApplication"("aadhaarKey");
