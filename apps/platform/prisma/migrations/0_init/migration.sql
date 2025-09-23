-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."TopicType" AS ENUM ('COLLEGE', 'PROGRAM', 'SUBJECT', 'STAFF', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "public"."DocumentFileType" AS ENUM ('EXAM', 'COLOQUIUM', 'COLOQUIUM_MID', 'COLOQUIUM_FINAL', 'COLOQUIUM_FIRST', 'COLOQUIUM_SECOND', 'COLOQUIUM_THIRD', 'COLOQUIUM_FOURTH', 'LAB_EXERCISE', 'LECTURE', 'PRESENTATION', 'HOMEWORK', 'EXERCISES', 'SEMINAR', 'SCRIPT', 'NOTES', 'PAPER', 'OTHER', 'SUMMER_EXAM', 'FALL_EXAM', 'WINTER_EXAM', 'SPRING_EXAM', 'DEAN_EXAM', 'CORRECTION_EXAM', 'ENTRANCE_EXAM', 'EXIT_EXAM', 'ORAL_EXAM', 'POP_EXAM', 'EXAM_THEORY', 'EXAM_PROBLEMS', 'SOLVED');

-- CreateEnum
CREATE TYPE "public"."RoleType" AS ENUM ('BASE', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "public"."RuleType" AS ENUM ('CAN_POST', 'CAN_CHANGE_PROFILE_BADGE', 'CAN_MASS_UPLOAD', 'CAN_MANAGE_USERS');

-- CreateEnum
CREATE TYPE "public"."ScopeType" AS ENUM ('GLOBAL', 'COLLEGE');

-- CreateEnum
CREATE TYPE "public"."SummaryType" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'WARNING');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('POST_REPLY', 'POST_VOTE', 'PACKAGE_UPGRADE', 'PACKAGE_DOWNGRADE');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."RoleType" NOT NULL DEFAULT 'BASE',
    "badge" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "type" "public"."TopicType" NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GeneralTopic" (
    "topicId" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "GeneralTopic_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "public"."College" (
    "topicId" TEXT NOT NULL,
    "externalLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "College_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "public"."Program" (
    "topicId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "programExternalCode" TEXT,
    "programExternalLink" TEXT,
    "departments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "type" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "public"."Subject" (
    "topicId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "ects" INTEGER,
    "externalCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "topicId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "staffExternalCode" TEXT,
    "staffExternalLink" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "public"."SubjectStaff" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "staffRole" TEXT,

    CONSTRAINT "SubjectStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProgramSubject" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semester" INTEGER,
    "groupName" TEXT,

    CONSTRAINT "ProgramSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "body" JSONB,
    "authorId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "replyToId" TEXT,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Vote" (
    "id" TEXT NOT NULL,
    "type" "public"."VoteType" NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."File" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT '',
    "size" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ImageFile" (
    "fileId" TEXT NOT NULL,
    "topicId" TEXT,
    "userId" TEXT,

    CONSTRAINT "ImageFile_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "public"."DocumentFile" (
    "fileId" TEXT NOT NULL,
    "postId" TEXT,
    "title" TEXT,
    "academicYear" TEXT,
    "types" "public"."DocumentFileType"[],

    CONSTRAINT "DocumentFile_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "rule" "public"."RuleType" NOT NULL,
    "value" BOOLEAN NOT NULL,
    "scopeType" "public"."ScopeType" NOT NULL,
    "scopeId" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."Summary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentiment" "public"."SummaryType" NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT,
    "authorId" TEXT,
    "recepientId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralTopic_topicId_key" ON "public"."GeneralTopic"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "College_topicId_key" ON "public"."College"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_topicId_key" ON "public"."Program"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_topicId_key" ON "public"."Subject"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_topicId_key" ON "public"."Staff"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "public"."File"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_fileId_key" ON "public"."ImageFile"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_topicId_key" ON "public"."ImageFile"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_userId_key" ON "public"."ImageFile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentFile_fileId_key" ON "public"."DocumentFile"("fileId");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GeneralTopic" ADD CONSTRAINT "GeneralTopic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."College" ADD CONSTRAINT "College_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Program" ADD CONSTRAINT "Program_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subject" ADD CONSTRAINT "Subject_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subject" ADD CONSTRAINT "Subject_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staff" ADD CONSTRAINT "Staff_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Staff" ADD CONSTRAINT "Staff_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "public"."College"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectStaff" ADD CONSTRAINT "SubjectStaff_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SubjectStaff" ADD CONSTRAINT "SubjectStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramSubject" ADD CONSTRAINT "ProgramSubject_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramSubject" ADD CONSTRAINT "ProgramSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImageFile" ADD CONSTRAINT "ImageFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImageFile" ADD CONSTRAINT "ImageFile_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ImageFile" ADD CONSTRAINT "ImageFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentFile" ADD CONSTRAINT "DocumentFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DocumentFile" ADD CONSTRAINT "DocumentFile_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Permission" ADD CONSTRAINT "Permission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Summary" ADD CONSTRAINT "Summary_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "public"."Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recepientId_fkey" FOREIGN KEY ("recepientId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

