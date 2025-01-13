/*
  Warnings:

  - You are about to drop the column `subjectExternalCode` on the `Subject` table. All the data in the column will be lost.
  - You are about to drop the column `subjectExternalLink` on the `Subject` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Subject" DROP COLUMN "subjectExternalCode",
DROP COLUMN "subjectExternalLink";
