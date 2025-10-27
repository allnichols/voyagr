import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";

export async function PATCH(req: NextRequest) {
  try {
    const { dayId, newPosition, activityId } = await req.json();

    const session = await auth();
    if (!session?.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await prisma.$transaction(async (prisma) => {
      const allActivities = await prisma.tripActivity.findMany({
        select: { id: true, position: true, place: true },
        where: { tripDayId: dayId },
        orderBy: { position: "asc" },
      });

      const activityToMove = allActivities.find(
        (activity) => activity.id === activityId,
      );
      if (!activityToMove) throw new Error("Activity to move not found");

      const activitiesToUpdate = allActivities.filter(
        (a) => a.id !== Number(activityId),
      );

      activitiesToUpdate.splice(newPosition, 0, activityToMove);

      for (let i = 0; i < activitiesToUpdate.length; i++) {
        const activity = activitiesToUpdate[i];

        await prisma.tripActivity.update({
          where: { id: activity.id },
          data: { position: i + 1 },
        });
      }
    });

    return NextResponse.json({
      message: "Activities reordered successfully",
      status: 200,
    });
  } catch (error) {
    console.error("Reorder activites error details:", {
      error: error,
      message: error instanceof Error ? error.message : "Unkown Error",
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
