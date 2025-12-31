import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/api-errors";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripDayId = searchParams.get("tripDayId");

  try {
    const session = await auth();

    let tripActivities = await prisma.tripActivity.findMany({
      where: {
        tripDayId: Number(tripDayId),
        userId: Number(session?.user.id),
      },
      orderBy: { position: "asc" },
    });

    if (!tripActivities) {
      throw new ApiError("Activites not found", "ACTIVITIES_NOT_FOUND", 404);
    }

    return NextResponse.json(tripActivities, { status: 200 });
  } catch (error) {
    console.error("Error fetching trip day:", {
      error: error instanceof Error ? error.message : "Unknown error",
      tripDayId,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return handleApiError(error);
  }
}
