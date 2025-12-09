import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tripId = req.nextUrl.searchParams.get("tripId");
    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 },
      );
    }

    const itineraryItems = await prisma.tripDay.findMany({
      where: { tripId: Number(tripId) },
      orderBy: { dayNumber: "asc" },
      include: {
        activities: {
          orderBy: { position: "asc" },
        },
      },
    });

    console.log(itineraryItems);
    return NextResponse.json(itineraryItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
