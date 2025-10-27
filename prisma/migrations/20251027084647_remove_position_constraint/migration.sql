-- DropIndex
DROP INDEX "public"."TripActivity_tripDayId_position_idx";

-- CreateIndex
CREATE INDEX "TripActivity_tripDayId_idx" ON "TripActivity"("tripDayId");
