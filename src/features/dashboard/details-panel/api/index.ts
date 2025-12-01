
export async function fetchActivity(id: number | null) {
    const res = await fetch(`/api/trip-activities/${id}`, { method: "GET"})
    if(!res.ok) throw new Error("Failed to fetch activity");
    return res.json();
}