
export async function getTripDayActivites(tripDayId: number | null) {
  const url = `/api/trip-activities${tripDayId !== null ? `?tripDayId=${tripDayId}` : ""}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get trip day ativities");
  return res.json();
}