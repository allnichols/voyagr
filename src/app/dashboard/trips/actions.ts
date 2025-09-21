"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTrips(userId = 1) {

    if (!userId) {
        throw new Error("User ID is required to fetch trips.");
    }

    try {
        const trips = await prisma.trip.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });

        return trips;
    } catch (error) {
        console.error("Error fetching trips:", error);
        throw new Error("Failed to fetch trips.");
    }
}