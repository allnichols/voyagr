import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId");

  if (!tripId) {
    return new Response(JSON.stringify({ error: "Missing tripId parameter" }), {
      status: 400,
    });
  }

  try {
    let tripDetails = await prisma.tripDay.findMany({
      where: { tripId: Number(tripId) },
      include: {
        activities: true,
      },
    });

    return new Response(JSON.stringify(tripDetails), { status: 200 });
  } catch (error) {
    console.error("Error fetching trip details:", error);
    return new Response(JSON.stringify({ error: error }), { status: 500 });
  }
}
