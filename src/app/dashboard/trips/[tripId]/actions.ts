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

export async function addActivity(dayId: number, title: string) {
    try {
        const newActivity = await prisma.tripActivity.create({
            data: {
                place: title,
                tripDayId: dayId,
            }
        });
        return newActivity;
    } catch (error) {
        console.error("Error adding activity:", error);
        throw new Error("Failed to add activity.");
    }
}

export async function deleteActivity(activityId: number) {
    try {
       const tripActivity =  await prisma.tripActivity.delete({
            where: { id: activityId }
        });

        console.log('deleted activity', tripActivity);

        return tripActivity;
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw new Error("Failed to delete activity.");
    }
}

export async function deleteDay(dayId: number) {
    try {
        const deletedDay = await prisma.tripDay.delete({
            where: { id: dayId }
        });
        return deletedDay;
    } catch (error) {
        console.error("Error deleting day:", error);
        throw new Error("Failed to delete day.");
    }
}