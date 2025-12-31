import { NextRequest, NextResponse, userAgent } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/api-errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId");

  try {
    const session = await auth();

    let trip = await prisma.tripDay.findMany({
      where: { id: Number(tripId), userId: Number(session?.user.id) },
      orderBy: { dayNumber: "desc" },
    });

    if (!trip) {
      throw new ApiError("Trip not found", "TRIP_NOT_FOUND", 404);
    }

    return NextResponse.json(trip, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip day:", {
      error: error instanceof Error ? error.message : "Unknown error",
      tripId,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return handleApiError(error);
  }
}
