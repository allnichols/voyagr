import { NextResponse, NextRequest } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import prisma from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import sanitizeText from "./sanatizeText";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tripId = req.nextUrl.searchParams.get("tripId");
    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 },
      );
    }

    const itineraryItems = await prisma.tripDay.findMany({
      where: { tripId: Number(tripId) },
      orderBy: { dayNumber: "asc" },
      include: {
        trip: {
            select: { destination: true }
        },
        activities: {
          orderBy: { position: "asc" },
        },
      },
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const destination = sanitizeText(itineraryItems[0]?.trip.destination || "Trip");
    page.drawText(`Itinerary for ${destination}`, {
      x: 50,
      y: 750,
      size: 20,
        font,
        color: rgb(0, 0, 0),
    });

    let yPosition = 720;
    for (const day of itineraryItems) {
    
      page.drawText(`Day ${day.dayNumber}: ${day.date.toDateString()}`, {
        x: 50,
        y: yPosition,
        size: 16,   
        font,
        color: rgb(0, 0, 0),
      });
      yPosition -=  20;
        for (const activity of day.activities) {
          const place = sanitizeText(activity.place || "N/A");
            page.drawText(`${activity.position}: ${place}`, {
                x: 70,
                y: yPosition,
                size: 12,
                font,
                color: rgb(0, 0, 0),
            });
            yPosition -=  15;
            const address = sanitizeText(activity.address || "N/A");
            page.drawText(`   Address: ${address}`, {
                x: 90,
                y: yPosition,
                size: 10,
                font,
                color: rgb(0, 0, 0),
            });
            yPosition -=  15;
            const phoneNumber = sanitizeText(activity.nationalPhoneNumber || "N/A");
            page.drawText(`   Phone: ${phoneNumber}`, {
                x: 90,
                y: yPosition,
                size: 10,
                font,
                color: rgb(0, 0, 0),
            });
            yPosition -=  15;
            const website = sanitizeText(activity.websiteUri || "N/A");
            page.drawText(`   Website: ${website}`, {
                x: 90,
                y: yPosition,
                size: 10,
                font,
                color: rgb(0, 0, 0),
            });
            yPosition -=  20;

        }
        yPosition -=  10;
    }

    const pdfBytes = await pdfDoc.save();

    const pdfBlob = new Blob([pdfBytes as any], { type: "application/pdf" });

    return new Response(pdfBlob, {
        headers: { 
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="itinerary_${itineraryItems[0]?.trip.destination || "trip"}.pdf"`
        }
    });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
