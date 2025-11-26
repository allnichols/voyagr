"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function removeTrip(tripId: number) {
  if (!tripId) {
    throw new Error("Trip ID is required to remove a trip.");
  }

  try {
    const removedTrip = await prisma.trip.delete({
      where: { id: tripId },
    });

    return removedTrip;
  } catch (error) {
    console.error("Error removing the trip:", error);
    throw new Error("failed to remove trip.");
  }
}
