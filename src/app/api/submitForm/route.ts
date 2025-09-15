import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PrismaClient } from '@prisma/client';
import parseTextReponse from './parseResponse';

// const GOOGLE_GENAI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GOOGLE_API_KEY = process.env.GOOGLE_GENAI_API_KEY; // Set this in your environment

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.json();
        if (!formData.destination || !formData.departureDate || !formData.returnDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log('Received form data:', formData);


        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `Create a travel itinerary for the following details:
                    Destination: ${formData.destination},
                    Dates: from ${formData.departureDate} to ${formData.returnDate},
                    Preferences: ${formData.preferences.join(", ")}

                    and respond with the following format

                    Destination: {destination}
                    Day {day} - {date}
                    Time: {morning | afternoon | evening}
                    Place: {place}
                    Description: {description}
                    Links: {descriptionLinks joined by commas}
                    address: {address}
                    `,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            }
        });

        const aiResponse = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const responseText = parseTextReponse(aiResponse);

        // Save to database
        await prisma.trip.create({
            data: {
                destination: formData.destination,
                departureDate: new Date(formData.departureDate),
                returnDate: new Date(formData.returnDate),
                preferences: Array.isArray(formData.preferences) ? formData.preferences.join(", ") : String(formData.preferences),
                aiData: responseText,
                user: {
                    connect: { id: 1 } // Make sure formData.userId is provided and valid
                }
            },
        });

        

        return NextResponse.json({ message: 'Form submitted successfully', data: responseText }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
