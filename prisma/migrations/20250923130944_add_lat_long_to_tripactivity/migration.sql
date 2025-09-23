/*
  Warnings:

  - You are about to drop the column `descriptions` on the `TripActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."TripActivity" DROP COLUMN "descriptions",
ADD COLUMN     "gPlaceId" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
