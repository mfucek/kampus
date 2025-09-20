-- AlterEnum
ALTER TYPE "public"."TopicType" ADD VALUE 'GENERAL';

-- CreateTable
CREATE TABLE "public"."GeneralTopic" (
    "topicId" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "GeneralTopic_pkey" PRIMARY KEY ("topicId")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralTopic_topicId_key" ON "public"."GeneralTopic"("topicId");

-- AddForeignKey
ALTER TABLE "public"."GeneralTopic" ADD CONSTRAINT "GeneralTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
