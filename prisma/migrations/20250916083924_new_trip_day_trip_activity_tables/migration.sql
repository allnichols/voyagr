/*
  Warnings:

  - You are about to drop the column `aiData` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `Trip` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Trip` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Trip" DROP COLUMN "aiData",
DROP COLUMN "preferences";

-- CreateTable
CREATE TABLE "public"."TripDay" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TripActivity" (
    "id" SERIAL NOT NULL,
    "tripDayId" INTEGER NOT NULL,
    "timeOfDay" TEXT,
    "place" TEXT NOT NULL,
    "descriptions" TEXT,
    "links" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TripDay_tripId_dayNumber_key" ON "public"."TripDay"("tripId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Trip_userId_key" ON "public"."Trip"("userId");

-- AddForeignKey
ALTER TABLE "public"."Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TripDay" ADD CONSTRAINT "TripDay_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "public"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TripActivity" ADD CONSTRAINT "TripActivity_tripDayId_fkey" FOREIGN KEY ("tripDayId") REFERENCES "public"."TripDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
