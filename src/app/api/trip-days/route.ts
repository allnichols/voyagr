import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tripId = searchParams.get("tripId");

  try {
    if (!tripId) {
      return new Response(JSON.stringify({ error: "No Trip found " }));
    }

    let tripDays = await prisma.tripDay.findMany({
      where: { tripId: Number(tripId) },
      orderBy: { dayNumber: "asc" },
    });

    return new Response(JSON.stringify(tripDays), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Internal Server Error" }));
  }
}
