import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get trip activities by tripDayId
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const tripDayId = searchParams.get('tripDayId')

    try{

        let tripActivities = await prisma.tripActivity.findMany({
            where: { tripDayId: Number(tripDayId), },
        })

        return new Response(JSON.stringify(tripActivities), { status: 200 }) 
    } catch {
        return new Response(JSON.stringify({ error: 'Internal Server Error'}))
    }
}