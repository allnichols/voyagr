import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a single trip activity
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;

    if (!resolvedParams.id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    const activityId = Number(resolvedParams.id);

    const activity = await prisma.tripActivity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json({ error: "No activity found" }, { status: 404 });
    }

    return NextResponse.json(activity, { status: 200 });
  } catch (error) {
    console.error("Error fetching activity by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 },
    );
  }
}
