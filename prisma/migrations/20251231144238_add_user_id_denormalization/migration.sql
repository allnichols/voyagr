/*
  Warnings:

  - Added the required column `userId` to the `TripActivity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TripDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."TripActivity_tripDayId_idx";

-- AlterTable
ALTER TABLE "TripActivity" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TripDay" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Trip_userId_idx" ON "Trip"("userId");

-- CreateIndex
CREATE INDEX "TripActivity_userId_idx" ON "TripActivity"("userId");

-- CreateIndex
CREATE INDEX "TripActivity_tripDayId_userId_idx" ON "TripActivity"("tripDayId", "userId");

-- CreateIndex
CREATE INDEX "TripDay_tripId_userId_idx" ON "TripDay"("tripId", "userId");

-- AddForeignKey
ALTER TABLE "TripDay" ADD CONSTRAINT "TripDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripActivity" ADD CONSTRAINT "TripActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
