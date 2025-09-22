"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTripDetails(tripId: number | null) {
    if (!tripId) {
        throw new Error("Trip ID is required to fetch trip details.");
    }

    try {
        const tripDetails = await prisma.tripDay.findMany({
            where: { tripId: tripId },
            include: {
                activities: true,
                trip: {
                    select: {
                        destination: true
                    }
                }
            }
        });
        return tripDetails
    } catch (error) {
        console.error("Error fetching trip details:", error);
        throw new Error("Failed to fetch trip details.");
    }
}