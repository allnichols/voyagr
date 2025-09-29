

export default function getGooglePlaces(parseAiResponse: {
    day: string;
    date: string;
    activities: any[];
}[], destination: string) {

    const googlePlaces = Promise.all(
        parseAiResponse.map(async (dayPlan) => {
            const activityResults = await Promise.all(
                dayPlan.activities.map(async (activity) => {
                    const headers: Record<string, string> = {
                        "Content-Type": "application/json",
                        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.priceLevel,places.id,places.types,places.iconMaskBaseUri",
                    };
                    if (process.env.GOOGLE_MAPS_API_KEY) {
                        headers["X-Goog-Api-Key"] = process.env.GOOGLE_MAPS_API_KEY;
                    }

                    const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ textQuery: `${activity.place} in ${destination}` }),
                        cache: "no-store"
                    });

                    if (!res.ok) {
                        console.log('Google api error', await res.text())
                    }

                    const data = await res.json();

                    return { 
                        gPlaceId: data.places[0].id,
                        address: data.places[0].formattedAddress,
                        latitude: data.places[0].location?.latitude,
                        longitude: data.places[0].location?.longitude,
                        place: data.places[0].displayName?.text,
                        timeOfDay: activity.time
                     };
                })
            );

            const tripDay = {
                date: dayPlan.date,
                dayNumber: dayPlan.day,
                activities: activityResults
            };

            return tripDay;    
        })
    );
    return googlePlaces

}