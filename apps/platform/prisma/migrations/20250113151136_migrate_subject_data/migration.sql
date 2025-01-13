-- transfer data from string members "subjectExternalCode" and "subjectExternalLink" to array members "externalCodes" and "externalLinks"
UPDATE "Subject" SET "externalCodes" = ARRAY["subjectExternalCode"] WHERE "subjectExternalCode" IS NOT NULL;
UPDATE "Subject" SET "externalLinks" = ARRAY["subjectExternalLink"] WHERE "subjectExternalLink" IS NOT NULL;

-- drop string members "subjectExternalCode" and "subjectExternalLink"
ALTER TABLE "Subject" DROP COLUMN "subjectExternalCode";
ALTER TABLE "Subject" DROP COLUMN "subjectExternalLink";

