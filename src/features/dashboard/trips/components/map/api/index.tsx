export async function getTripActivities(
  tripDayID: number | null,
  destination: string | null = null,
) {
  const url = `/api/trip-activities${tripDayID !== null ? `?tripDayId=${tripDayID}` : ""}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get trip activities");
  return res.json();
}

export async function getDestinationLatLong(destination: string) {
  let city = destination.split(",")[0];
  let country = destination.split(",").slice(-1)[0].trim();

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  if (usStates.includes(country)) {
    country = "USA";
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`,
  );
  if (!res.ok) throw new Error("Failed to fetch destination coordinates");
  const data = await res.json();
  if (data.length === 0)
    throw new Error("No coordinates found for destination");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}
