/*
  Warnings:

  - You are about to drop the column `links` on the `TripActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Trip" ADD COLUMN     "preferences" TEXT[];

-- AlterTable
ALTER TABLE "public"."TripActivity" DROP COLUMN "links";
