
export async function getTrips() {
  const res = await fetch("/api/trips", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}