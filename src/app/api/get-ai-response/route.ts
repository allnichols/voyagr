import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import parseTextReponse from "./parseResponse";
import getGooglePlaces from "./getGooglePlaces";
import { auth } from "../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY; // Set this in your environment

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });


export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if(!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const user = await prisma.user.findUnique({
      where:  { email: session.user.email as string },
    })

    if(!user) {
      return NextResponse.json(
        { error: "Unauthorized - user not found"},
        { status: 401 }
      )
    }

    const formData = await req.json();
    if (
      !formData.destination ||
      !formData.dates ||
      !formData.dates.from ||
      !formData.dates.to
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }


    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `Create a travel itinerary for the following details:
                    Destination: ${formData.destination},
                    Dates: from ${formData.dates.from} to ${formData.dates.to},
                    Preferences: ${formData.preferences.join(", ")}

                    and respond with the following format. Do not use any other format:
                    Avoid using ** or any markdown formatting. Just plain text.

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
      
    const parsedResponse = await parseTextReponse(aiResponse);


    if(parsedResponse.length === 0) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    const googlePlaces = await getGooglePlaces(
      parsedResponse,
      formData.destination,
    );


    if (googlePlaces.length === 0) {
      return NextResponse.json(
        { message: "Failed to fetch places from Google Places API" },
        { status: 500 },
      );
    }

    console.log("Final structured itinerary with Google Places data:", googlePlaces);

    const createdTrip = await prisma.trip.create({
      data: {
        userId: user.id,
        destination: formData.destination,
        departureDate: new Date(formData.dates.from),
        returnDate: new Date(formData.dates.to),
        preferences: formData.preferences,
        days: {
          create: googlePlaces.map((day) => ({
            date: new Date(day.date),
            dayNumber: parseInt(day.dayNumber),
            activities: {
              create: day.activities.map((activity, i) => ({
                timeOfDay: activity.timeOfDay,
                place: activity.place,
                position: i + 1,
                address: activity.address,
                longitude: activity.longitude,
                latitude: activity.latitude,
                gPlaceId: activity.gPlaceId,
                iconMask: activity.iconMask,
                rating: activity.rating,
                userRatingCount: activity.userRatingCount,
                websiteUri: activity.websiteUri,
                internationalPhoneNumber: activity.internationalPhoneNumber,
                nationalPhoneNumber: activity.nationalPhoneNumber,
                priceLevel: activity.priceLevel,
                types: activity.types.join(", "),
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json({ createdTrip });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
