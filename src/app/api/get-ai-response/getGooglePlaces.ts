export default async function getGooglePlaces(
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
      console.log(`Processing day plan:`, dayPlan.day, `with ${dayPlan.activities.length} activities`);
      
      try {
        const activityResults = await Promise.all(
          dayPlan.activities.map(async (activity) => {
            console.log(`Processing activity: "${activity.place}" in ${destination}`);
            
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
            console.log('place details:', place);
            console.log(`Found place for "${activity.place}":`, {
              id: place.id,
              displayName: place.displayName?.text,
              address: place.formattedAddress
            });
            
            return {
              gPlaceId: place.id,
              address: place.formattedAddress,
              latitude: place.location?.latitude,
              longitude: place.location?.longitude,
              place: place.displayName?.text,
              timeOfDay: activity.time,
              iconMask: place.iconMaskBaseUri ? place.iconMaskBaseUri : null,
            };
          })
        );
        
        const tripDay = {
          date: dayPlan.date,
          dayNumber: dayPlan.day,
          activities: activityResults,
        };

        return tripDay;
        
      } catch (error) {
        console.error(`Error processing day ${dayPlan.day}:`, error instanceof Error ? error.message : String(error));
        throw new Error(`Error getting places from google for day ${dayPlan.day}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }),
  );
  return googlePlaces;
}
