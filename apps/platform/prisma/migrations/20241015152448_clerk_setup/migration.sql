-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('FREE', 'PREMIUM_MONTHLY', 'PRO_MONTHLY', 'LIFETIME');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "package" "PackageType",
    "status" "AccountStatus" NOT NULL DEFAULT 'INACTIVE',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
