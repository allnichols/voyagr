import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId parameter" }), {
      status: 400,
    });
  }

  try {
    let trips = await prisma.trip.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(trips), { status: 200 });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
