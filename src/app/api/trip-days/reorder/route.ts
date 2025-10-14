import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
    try {
        const { tripId, dayId, newPosition } = await req.json();

        const days = await prisma.tripDay.findMany({
            where: { tripId: Number(tripId) },
            orderBy: { dayNumber: 'asc' }
        });

        const dayToMove = days.find(day => day.id === Number(dayId));
        if(!dayToMove) {
            return NextResponse.json({ error: "Day not found" }, { status: 404 });
        }

        const updatedDays = days.filter(day => day.id !== Number(dayId));

        updatedDays.splice(newPosition, 0, dayToMove);

        const updatePromises = updatedDays.map((day, index) => {
            return prisma.tripDay.update({
                where: { id: day.id},
                data: { dayNumber: index }
            })
        });

        await Promise.all(updatePromises);
        return NextResponse.json({ message: "Day reordered successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}