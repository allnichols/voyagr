import { NextRequest } from "next/server";
import { auth } from '@/app/api/auth/[...nextauth]/auth';
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {

  const session = await auth();
  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }


  try {
    let trips = await prisma.trip.findMany({
      where: { userId: Number(session.user.id) },
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
