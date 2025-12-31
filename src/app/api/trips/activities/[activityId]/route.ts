import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiError, handleApiError } from "@/lib/api-errors";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const resolvedParams = await params;

    if (!resolvedParams.id) {
      throw new ApiError("No ID provided", "NO_ID_PROVIDED", 400);
    }

    const activityId = Number(resolvedParams.id);

    const activity = await prisma.tripActivity.findUnique({
      where: {
        id: activityId,
        userId: Number(session?.user.id),
      },
    });

    if (!activity) {
      throw new ApiError("Activity not found", "ACTIVITY_NOT_FOUND", 404);
    }

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.error("Error fetching activity:", {
      error: error instanceof Error ? error.message : "Unknown error",
      activityId: params,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    return handleApiError(error);
  }
}
