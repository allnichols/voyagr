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

export async function fetchPlace(query: string) {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.priceLevel,places.id,places.types",
    };
    if (process.env.GOOGLE_MAPS_API_KEY) {
        headers["X-Goog-Api-Key"] = process.env.GOOGLE_MAPS_API_KEY;
    }

    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers,
        body: JSON.stringify({ textQuery: query }), 
        cache: "no-store"
    })

    if(!res.ok) {
        console.error('Google API Error:', await res.text())
        return null;
    }

    const data = await res.json();
    const place = data.places;
    if(!place) return null;
    console.log(data);
    return { 
        query, 
        places: place
    }
}

export async function addActivity(dayId: number, place: string) {

    try {
        const newActivity = await prisma.tripActivity.create({
            data: {
                place: place,
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