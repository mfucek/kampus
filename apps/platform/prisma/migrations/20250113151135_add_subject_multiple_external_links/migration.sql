-- AlterTable
ALTER TABLE "Subject" ADD COLUMN     "externalCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "externalLinks" TEXT[] DEFAULT ARRAY[]::TEXT[];
