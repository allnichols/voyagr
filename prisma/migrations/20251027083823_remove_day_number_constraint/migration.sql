/*
  Warnings:

  - A unique constraint covering the columns `[tripId]` on the table `TripDay` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."TripDay_tripId_dayNumber_key";

-- CreateIndex
CREATE UNIQUE INDEX "TripDay_tripId_key" ON "TripDay"("tripId");
