-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('MONTHLY_CHEAP', 'MONTHLY_PRO', 'LIFETIME');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TopicType" AS ENUM ('SUBJECT', 'STAFF', 'PROGRAM');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "DocumentFileType" AS ENUM ('EXAM', 'COLOQUIUM', 'COLOQUIUM_MID', 'COLOQUIUM_FINAL', 'COLOQUIUM_FIRST', 'COLOQUIUM_SECOND', 'COLOQUIUM_THIRD', 'COLOQUIUM_FOURTH', 'LAB_EXERCISE', 'LECTURE', 'PRESENTATION', 'HOMEWORK', 'EXERCISES', 'SEMINAR', 'SCRIPT', 'NOTES', 'PAPER', 'OTHER', 'SUMMER_EXAM', 'FALL_EXAM', 'WINTER_EXAM', 'SPRING_EXAM', 'DEAN_EXAM', 'CORRECTION_EXAM', 'ENTRANCE_EXAM', 'EXIT_EXAM', 'ORAL_EXAM', 'POP_EXAM', 'EXAM_THEORY', 'EXAM_PROBLEMS', 'SOLVED');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('BASE', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "RuleType" AS ENUM ('CAN_POST', 'CAN_CHANGE_PROFILE_BADGE', 'CAN_MASS_UPLOAD', 'CAN_MANAGE_USERS');

-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('GLOBAL', 'COLLEGE');

-- CreateEnum
CREATE TYPE "SummaryType" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'WARNING');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('POST_REPLY', 'POST_VOTE', 'PACKAGE_UPGRADE', 'PACKAGE_DOWNGRADE');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "stripeCustomerId" TEXT,
    "package" "PackageType",
    "status" "AccountStatus" NOT NULL DEFAULT 'INACTIVE',
    "activeUntil" TIMESTAMP(3),
    "role" "RoleType" NOT NULL DEFAULT 'BASE',

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "badge" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconSrc" TEXT,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT,
    "collegeId" TEXT NOT NULL,
    "type" "TopicType" NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "topicId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "staffExternalCode" TEXT,
    "staffExternalLink" TEXT,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "Subject" (
    "topicId" TEXT NOT NULL,
    "ects" INTEGER,
    "subjectExternalCode" TEXT,
    "subjectExternalLink" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "Program" (
    "topicId" TEXT NOT NULL,
    "programExternalCode" TEXT,
    "programExternalLink" TEXT,
    "departments" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "type" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("topicId")
);

-- CreateTable
CREATE TABLE "SubjectStaff" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "staffRole" TEXT,

    CONSTRAINT "SubjectStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramSubject" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "semester" INTEGER,
    "groupName" TEXT,

    CONSTRAINT "ProgramSubject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "topicId" TEXT,
    "replyToId" TEXT,
    "body" JSONB,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
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
CREATE TABLE "ImageFile" (
    "fileId" TEXT NOT NULL,
    "topicId" TEXT,
    "collegeId" TEXT,
    "userId" TEXT,

    CONSTRAINT "ImageFile_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "DocumentFile" (
    "fileId" TEXT NOT NULL,
    "postId" TEXT,
    "title" TEXT,
    "academicYear" TEXT,
    "types" "DocumentFileType"[],

    CONSTRAINT "DocumentFile_pkey" PRIMARY KEY ("fileId")
);

-- CreateTable
CREATE TABLE "Permission" (
    "accountId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "rule" "RuleType" NOT NULL,
    "value" BOOLEAN NOT NULL,
    "scopeType" "ScopeType" NOT NULL,
    "scopeId" TEXT,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Summary" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentiment" "SummaryType" NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "Summary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT,
    "authorId" TEXT,
    "recepientId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_clerkUserId_key" ON "Account"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_accountId_key" ON "User"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "College_slug_key" ON "College"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_topicId_key" ON "Staff"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_topicId_key" ON "Subject"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "Program_topicId_key" ON "Program"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "File_key_key" ON "File"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_fileId_key" ON "ImageFile"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_topicId_key" ON "ImageFile"("topicId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_collegeId_key" ON "ImageFile"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "ImageFile_userId_key" ON "ImageFile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentFile_fileId_key" ON "DocumentFile"("fileId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectStaff" ADD CONSTRAINT "SubjectStaff_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectStaff" ADD CONSTRAINT "SubjectStaff_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSubject" ADD CONSTRAINT "ProgramSubject_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSubject" ADD CONSTRAINT "ProgramSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("topicId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_replyToId_fkey" FOREIGN KEY ("replyToId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageFile" ADD CONSTRAINT "ImageFile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentFile" ADD CONSTRAINT "DocumentFile_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recepientId_fkey" FOREIGN KEY ("recepientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

