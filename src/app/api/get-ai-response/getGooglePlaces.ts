export default function getGooglePlaces(
  parseAiResponse: {
    day: string;
    date: string;
    activities: any[];
  }[],
  destination: string,
) {
  // Validate Google Maps API key
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    throw new Error("Google Maps API key is not configured");
  }

  const googlePlaces = Promise.all(
    parseAiResponse.map(async (dayPlan) => {
      const activityResults = await Promise.all(
        dayPlan.activities.map(async (activity) => {
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.location,places.priceLevel,places.id,places.types,places.iconMaskBaseUri",
            "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
          };

          const res = await fetch(
            "https://places.googleapis.com/v1/places:searchText",
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                textQuery: `${activity.place} in ${destination}`,
              }),
              cache: "no-store",
            },
          );

          if (!res.ok) {
            const errorText = await res.text();
            console.error("Google API error:", res.status, res.statusText, errorText);
            throw new Error(`Google API request failed: ${res.status} ${res.statusText}`);
          }

          const data = await res.json();

          if (!data.places || data.places.length === 0) {
            console.warn(`No places found for "${activity.place} in ${destination}"`);
            throw new Error(`No places found for "${activity.place} in ${destination}"`);
          }

          const place = data.places[0];
          
          return {
            gPlaceId: place.id,
            address: place.formattedAddress,
            latitude: place.location?.latitude,
            longitude: place.location?.longitude,
            place: place.displayName?.text,
            timeOfDay: activity.time,
          };
        }),
      ).catch((error) => {
        console.error("Error in activity processing:", error.message);
        throw new Error(`Error getting places from google: ${error.message}`);
      });

      const tripDay = {
        date: dayPlan.date,
        dayNumber: dayPlan.day,
        activities: activityResults,
      };

      return tripDay;
    }),
  );
  return googlePlaces;
}
