-- DropIndex
DROP INDEX "public"."TripDay_tripId_key";

-- CreateIndex
CREATE INDEX "TripDay_tripId_idx" ON "TripDay"("tripId");
