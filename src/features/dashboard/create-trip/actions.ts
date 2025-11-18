"use server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import parseTextReponse from "./parseResponse";

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY; // Set this in your environment
const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
const prisma = new PrismaClient();

type TripData = {
  destination: string;
  departureDate: string;
  returnDate: string;
  preferences: string[];
};

async function fetchGooglePlace(place: string, destination: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Goog-FieldMask":
      "places.displayName,places.formattedAddress,places.location,places.id,places.iconMaskBaseUri",
  };

  if (process.env.GOOGLE_MAPS_API_KEY) {
    headers["X-Goog-Api-Key"] = process.env.GOOGLE_MAPS_API_KEY;
  }

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ textQuery: `${place} in ${destination}` }),
    },
  );

  if (!res.ok) {
    console.error("Google API Error: ", await res.text());
    return null;
  }

  const data = await res.json();
  const placeInfo = data.place;

  return placeInfo;
}

export async function createTrip(tripData: TripData) {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Create a travel itinerary for the following details:
                    Destination: ${tripData.destination},
                    Dates: from ${tripData.departureDate} to ${tripData.returnDate},
                    Preferences: ${tripData.preferences.join(", ")}

                    and respond with the following format

                    Day {day} - {date}
                    Time: {morning | afternoon | evening}
                    Place: {place}
                    Description: {description}
                    Address: {address}
                    `,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      },
    });

    const aiResponse =
      response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const responseText = parseTextReponse(aiResponse);

    console.log(aiResponse);

    await prisma.trip.create({
      data: {
        userId: 1,
        destination: tripData.destination,
        departureDate: new Date(tripData.departureDate),
        returnDate: new Date(tripData.returnDate),
        days: {
          create: responseText.map((day) => ({
            date: new Date(day.date),
            dayNumber: parseInt(day.day),
            activities: {
              create: day.activities.map((activity) => ({
                timeOfDay: activity.time,
                place: activity.place,
                address: activity.address,
                links: activity.links,
              })),
            },
          })),
        },
      },
    });

    return;
  } catch (error) {
    console.error("Error fetching trips: ", error);
    throw new Error("Failed to fetch trips");
  }
}
