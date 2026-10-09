-- Baseline migration (hand-written to match schema.prisma). Verify with:
--   npx prisma migrate diff --from-migrations prisma/migrations --to-schema-datamodel prisma/schema.prisma --shadow-database-url "$SHADOW_URL" --exit-code
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');
CREATE TYPE "SubmissionStatus" AS ENUM ('NEW', 'CONTACTED', 'APPROVED', 'DECLINED', 'ARCHIVED');
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

CREATE TABLE "AdminUser" ("id" TEXT NOT NULL,"email" TEXT NOT NULL,"name" TEXT NOT NULL,"passwordHash" TEXT NOT NULL,"role" "Role" NOT NULL DEFAULT 'EDITOR',"active" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ProgramCategory" ("id" TEXT NOT NULL,"name" TEXT NOT NULL,"slug" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "ProgramCategory_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Program" ("id" TEXT NOT NULL,"title" TEXT NOT NULL,"slug" TEXT NOT NULL,"summary" VARCHAR(300) NOT NULL,"body" TEXT,"published" BOOLEAN NOT NULL DEFAULT false,"sortOrder" INTEGER NOT NULL DEFAULT 0,"categoryId" TEXT,"imageId" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Program_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ArticleCategory" ("id" TEXT NOT NULL,"name" TEXT NOT NULL,"slug" TEXT NOT NULL,CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Article" ("id" TEXT NOT NULL,"title" TEXT NOT NULL,"slug" TEXT NOT NULL,"excerpt" VARCHAR(300) NOT NULL,"body" TEXT NOT NULL,"published" BOOLEAN NOT NULL DEFAULT false,"publishedAt" TIMESTAMP(3),"seoTitle" VARCHAR(70),"seoDescription" VARCHAR(160),"categoryId" TEXT,"authorId" TEXT,"imageId" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Article_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ImpactStat" ("id" TEXT NOT NULL,"label" TEXT NOT NULL,"value" INTEGER NOT NULL DEFAULT 0,"suffix" TEXT NOT NULL DEFAULT '+',"verified" BOOLEAN NOT NULL DEFAULT false,"published" BOOLEAN NOT NULL DEFAULT false,"sortOrder" INTEGER NOT NULL DEFAULT 0,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "ImpactStat_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ImpactStory" ("id" TEXT NOT NULL,"initiative" TEXT NOT NULL,"community" TEXT NOT NULL,"action" TEXT NOT NULL,"result" TEXT NOT NULL,"published" BOOLEAN NOT NULL DEFAULT false,"occurredAt" TIMESTAMP(3),"imageId" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "ImpactStory_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Volunteer" ("id" TEXT NOT NULL,"fullName" TEXT NOT NULL,"email" TEXT NOT NULL,"phone" TEXT,"location" TEXT,"interest" TEXT NOT NULL,"availability" TEXT,"message" TEXT,"status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id"));
CREATE TABLE "PartnershipRequest" ("id" TEXT NOT NULL,"organization" TEXT NOT NULL,"contactPerson" TEXT NOT NULL,"email" TEXT NOT NULL,"phone" TEXT,"partnershipType" TEXT NOT NULL,"message" TEXT,"status" "SubmissionStatus" NOT NULL DEFAULT 'NEW',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "PartnershipRequest_pkey" PRIMARY KEY ("id"));
CREATE TABLE "ContactMessage" ("id" TEXT NOT NULL,"name" TEXT NOT NULL,"email" TEXT NOT NULL,"phone" TEXT,"subject" TEXT NOT NULL,"message" TEXT NOT NULL,"status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id"));
CREATE TABLE "SiteSetting" ("key" TEXT NOT NULL,"value" TEXT NOT NULL,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key"));
CREATE TABLE "Media" ("id" TEXT NOT NULL,"url" TEXT NOT NULL,"storageKey" TEXT NOT NULL,"mimeType" TEXT NOT NULL,"sizeBytes" INTEGER NOT NULL,"alt" TEXT NOT NULL,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Media_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
CREATE UNIQUE INDEX "ProgramCategory_name_key" ON "ProgramCategory"("name");
CREATE UNIQUE INDEX "ProgramCategory_slug_key" ON "ProgramCategory"("slug");
CREATE UNIQUE INDEX "Program_slug_key" ON "Program"("slug");
CREATE INDEX "Program_published_sortOrder_idx" ON "Program"("published", "sortOrder");
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");
CREATE UNIQUE INDEX "ArticleCategory_slug_key" ON "ArticleCategory"("slug");
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE INDEX "Article_published_publishedAt_idx" ON "Article"("published", "publishedAt");
CREATE INDEX "ImpactStat_verified_published_sortOrder_idx" ON "ImpactStat"("verified", "published", "sortOrder");
CREATE INDEX "ImpactStory_published_createdAt_idx" ON "ImpactStory"("published", "createdAt");
CREATE INDEX "Volunteer_status_createdAt_idx" ON "Volunteer"("status", "createdAt");
CREATE INDEX "PartnershipRequest_status_createdAt_idx" ON "PartnershipRequest"("status", "createdAt");
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");
CREATE UNIQUE INDEX "Media_storageKey_key" ON "Media"("storageKey");
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");

ALTER TABLE "Program" ADD CONSTRAINT "Program_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ProgramCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Program" ADD CONSTRAINT "Program_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ArticleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ImpactStory" ADD CONSTRAINT "ImpactStory_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
