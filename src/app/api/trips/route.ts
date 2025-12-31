import { auth } from '../auth/[...nextauth]/auth';
import prisma from "@/lib/prisma";
import { Trip } from '@prisma/client';

/**
 * GET /api/trips
 * Fetches all trips associated with the authenticated user.
  * @returns {Promise<Response>} A response containing the list of trips or an error message.
 */
export async function GET(): Promise<Response> {
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
