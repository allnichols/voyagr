import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const { tripId, dayId, newPosition } = await req.json();
    console.log("Reorder Request:", { tripId, dayId, newPosition });

    await prisma.$transaction(async (prisma) => {
      const allDays = await prisma.tripDay.findMany({
        where: { tripId },
        orderBy: { dayNumber: "asc" },
      });

      const dayToMove = allDays.find((day) => day.id === dayId);
      if (!dayToMove) throw new Error("Day to move not found");

      if (newPosition < 1 || newPosition > allDays.length) {
        throw new Error("Invalid new position");
      }

      const tempPosition = 99999;
      await prisma.tripDay.update({
        where: { id: dayToMove.id },
        data: { dayNumber: tempPosition },
      });

      const daysToUpdate = allDays.filter((day) => day.id !== Number(dayId));

      daysToUpdate.splice(newPosition - 1, 0, dayToMove);

      for (let i = 0; i < daysToUpdate.length; i++) {
        const day = daysToUpdate[i];
        const newDayNumber = i + 1;

        if (day.id === dayId) continue;

        if (day.dayNumber !== newDayNumber) {
          await prisma.tripDay.update({
            where: { id: day.id },
            data: { dayNumber: newDayNumber },
          });
        }
      }

      await prisma.tripDay.update({
        where: { id: dayId },
        data: {
            dayNumber: newPosition,
        }
      })
    });

    return NextResponse.json(
      { message: "Day reordered successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reorder error details:", {
      error: error,
      message: error instanceof Error ? error.message : "Unknown error",
      // stack: error instanceof Error ? error.stack : 'No stack trace'
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
