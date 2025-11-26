import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageRef = searchParams.get("image_ref");

  if (!imageRef) {
    return NextResponse.json(
      { error: "Image ref is required" },
      { status: 400 },
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${imageRef}&key=${apiKey}`,
    );

    if (!res.ok) {
      throw new Error(`Goolge Image API error: ${res.statusText}`);
    }

    const imageBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Error fetching google photos: ", error);
    return NextResponse.json(
      { error: "Failed to fetch place photo" },
      { status: 500 },
    );
  }
}
