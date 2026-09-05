-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Lecture', 'Lab', 'Clinical', 'Study');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "place" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "remind" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectGoal" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "hoursGoal" DOUBLE PRECISION NOT NULL,
    "hoursDone" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SubjectGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "kept" BOOLEAN NOT NULL,

    CONSTRAINT "DayLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationToggle" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationToggle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "hoursLogged" INTEGER NOT NULL,
    "planKeptPct" INTEGER NOT NULL,
    "bestStreak" INTEGER NOT NULL,
    "dailyTargetH" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProfileInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_date_idx" ON "Activity"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DayLog_date_key" ON "DayLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationToggle_key_key" ON "NotificationToggle"("key");
