-- This migration adds real user accounts and per-user data scoping. The only
-- rows that exist at this point are throwaway demo/seed data (no real user
-- accounts existed before this migration, since auth didn't exist yet), so
-- they're cleared rather than migrated forward.
DELETE FROM "Activity";
DELETE FROM "Deadline";
DELETE FROM "NotificationToggle";
DELETE FROM "SubjectGoal";

-- DropIndex
DROP INDEX "NotificationToggle_key_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Deadline" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NotificationToggle" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubjectGoal" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "hoursDone" SET DEFAULT 0;

-- DropTable
DROP TABLE "DayLog";

-- DropTable
DROP TABLE "ProfileInfo";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "dailyTargetH" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE INDEX "Deadline_userId_idx" ON "Deadline"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationToggle_userId_key_key" ON "NotificationToggle"("userId", "key");

-- CreateIndex
CREATE INDEX "SubjectGoal_userId_idx" ON "SubjectGoal"("userId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectGoal" ADD CONSTRAINT "SubjectGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationToggle" ADD CONSTRAINT "NotificationToggle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
