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
      try {
        const activityResults = await Promise.all(
          dayPlan.activities.map(async (activity) => {
            const headers: Record<string, string> = {
              "Content-Type": "application/json",
              "X-Goog-FieldMask": [
                "places.displayName",
                "places.formattedAddress",
                "places.location",
                "places.priceLevel",
                "places.id",
                "places.types",
                "places.iconMaskBaseUri",
                "places.rating",
                "places.userRatingCount",
                "places.internationalPhoneNumber",
                "places.nationalPhoneNumber",
                "places.websiteUri",
              ].join(","),
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
              throw new Error(
                `Google API request failed: ${res.status} ${res.statusText}`,
              );
            }

            const data = await res.json();

            if (!data.places || data.places.length === 0) {
              console.warn(
                `No places found for "${activity.place} in ${destination}"`,
              );

              return {
                gPlaceId: null,
                address: null,
                latitude: null,
                longitude: null,
                place: activity.place,
                timeOfDay: activity.timeOfDay,
                iconMask: null,
                rating: null,
                userRatingCount: null,
                websiteUri: null,
                internationalPhoneNumber: null,
                nationalPhoneNumber: null,
                priceLevel: null,
                types: null,
              };
            }

            const place = data.places[0];

            return {
              gPlaceId: place.id,
              address: place.formattedAddress,
              latitude: place.location?.latitude,
              longitude: place.location?.longitude,
              place: place.displayName?.text,
              timeOfDay: activity.time,
              iconMask: place.iconMaskBaseUri ? place.iconMaskBaseUri : null,
              rating: place.rating ? place.rating : null,
              userRatingCount: place.userRatingCount
                ? place.userRatingCount
                : null,
              websiteUri: place.websiteUri ? place.websiteUri : null,
              internationalPhoneNumber: place.internationalPhoneNumber
                ? place.internationalPhoneNumber
                : null,
              nationalPhoneNumber: place.nationalPhoneNumber
                ? place.nationalPhoneNumber
                : null,
              priceLevel: place.priceLevel ? place.priceLevel : null,
              types: place.types ? place.types : null,
            };
          }),
        );

        const tripDay = {
          date: dayPlan.date,
          dayNumber: dayPlan.day,
          activities: activityResults,
        };

        return tripDay;
      } catch (error) {
        console.error(
          `Error processing day ${dayPlan.day}:`,
          error instanceof Error ? error.message : String(error),
        );
        throw new Error(
          `Error getting places from google for day ${dayPlan.day}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }),
  );
  return googlePlaces;
}
