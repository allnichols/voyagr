import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";

export async function PATCH(req: NextRequest) {
  try {
    const { tripId, dayId, newDayNumber } = await req.json();
    const session = await auth();

    if (!session?.user.id) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }
    console.log(session);
    console.log("Reorder Request:", { tripId, dayId, newDayNumber });

    prisma.$transaction(async (tx) => {
      const allDays = await tx.tripDay.findMany({
        where: { tripId: tripId },
        orderBy: { dayNumber: 'asc' },
      })

      const dayToMove = allDays.find(d => d.id === dayId);

      if(!dayToMove) throw new Error("Day to move not found");

      const daysToUpdate = allDays.filter(d => d.id !== dayId);

      daysToUpdate.splice(newDayNumber - 1, 0, dayToMove);
      
      for (let i = 0; i < daysToUpdate.length; i++) {
        const day = daysToUpdate[i];
        
        await tx.tripDay.update({
          where: { id: day.id },
          data: { dayNumber: i + 1 }
        })

      }

    })

    return NextResponse.json(
      { message: "Day reordered successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reorder error details:", {
      error: error,
      message: error instanceof Error ? error.message : "Unknown error",
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
