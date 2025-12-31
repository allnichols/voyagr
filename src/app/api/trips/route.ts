import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/api-errors";

export async function GET(): Promise<Response> {
  try {
    const session = await auth();
    let trips = await prisma.trip.findMany({
      where: { userId: Number(session?.user.id) },
      orderBy: { createdAt: "desc" },
    });

    if (!trips) {
      throw new ApiError("Trips not found", "TRIPS_NOT_FOUND", 404);
    }

    return NextResponse.json(trips, { status: 200 });
  } catch (error) {
    console.error("Error fetching trips:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return handleApiError(error);
  }
}
