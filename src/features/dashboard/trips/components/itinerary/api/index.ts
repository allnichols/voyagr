
export async function getTripDays(tripId: number | null) {
  const url = `/api/trip-days${tripId !== null ? `?tripId=${tripId}` : ""}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get trip days");
  return res.json();
}

export async function downloadItinerary(tripId: number | string) {
    const url = `/api/trips/download?tripId=${tripId}`;
    const res = await fetch(url, { method: "GET" });
    if(!res.ok) throw new Error("Failed to download itinerary");
    return res.json();
}