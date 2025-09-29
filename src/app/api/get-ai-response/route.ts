import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PrismaClient } from '@prisma/client';
import parseTextReponse from './parseResponse';
import getGooglePlaces from './getGooglePlaces';

const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY; // Set this in your environment

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json();
        if (!formData.destination || !formData.departureDate || !formData.returnDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `Create a travel itinerary for the following details:
                    Destination: ${formData.destination},
                    Dates: from ${formData.departureDate} to ${formData.returnDate},
                    Preferences: ${formData.preferences.join(", ")}

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
            }
        });

        const aiResponse = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const parsedResponse = parseTextReponse(aiResponse);

        const googlePlaces = await getGooglePlaces(parsedResponse, formData.destination);

        console.log(googlePlaces)
        const createdTrip = await prisma.trip.create({
            data: {
                userId: 1,
                destination: formData.destination,
                departureDate: new Date(formData.departureDate),
                returnDate: new Date(formData.returnDate),
                days: {
                    create: googlePlaces.map(day => ({
                        date: new Date(day.date),
                        dayNumber: parseInt(day.dayNumber),
                        activities: {
                            create: day.activities.map(activity => ({
                                timeOfDay: activity.timeOfDay,
                                place: activity.place,
                                address: activity.address,
                                longitude: activity.longitude,
                                latitude: activity.latitude,
                                gPlaceId: activity.gPlaceId
                            }))
                        }
                    }))
                }
            }
        });

        return NextResponse.json({ createdTrip })
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}