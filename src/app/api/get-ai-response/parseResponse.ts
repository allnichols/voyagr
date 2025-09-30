export default function parseTextReponse(responseText: string) {
  const lines = responseText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let currentDay = "";
  let currentDate = "";
  let days: { day: string; date: string; activities: any[] }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const dayMatch = line.match(/^Day (\d+) - (\d{4}-\d{2}-\d{2})$/);
    if (dayMatch) {
      currentDay = dayMatch[1];
      currentDate = dayMatch[2];

      if (!days.find((d) => d.day === currentDay && d.date === currentDate)) {
        days.push({ day: currentDay, date: currentDate, activities: [] });
      }

      continue;
    }

    const timeMatch = line.match(/^Time:\s*(.+)$/);
    if (timeMatch) {
      const time = timeMatch[1];
      const placeLine = lines[++i] || "";
      const placeMatch = placeLine.match(/^Place:\s*(.+)$/);
      const place = placeMatch ? placeMatch[1] : "";

      const descriptionLine = lines[++i] || "";
      const descriptionMatch = descriptionLine.match(/^Description:\s*(.+)$/);
      const description = descriptionMatch ? descriptionMatch[1] : "";
      const addressLine = lines[++i] || "";
      const addressMatch = addressLine.match(/^Address:\s*(.+)$/);
      const address = addressMatch ? addressMatch[1] : "";
      const dayObj = days.find((d) => d.day === currentDay);
      if (dayObj) {
        dayObj.activities.push({ time, place, description, address });
      }
    }
  }

  return days;
}

// Lines: [
//   "Here's a possible itinerary for your Tokyo trip, balancing museums and nature:",
//   'Destination: Tokyo, Japan',
//   'Day 1 - 2025-09-16',
//   'Time: Morning',
//   'Place: Ghibli Museum',
//   'Description: Immerse yourself in the whimsical world of Studio Ghibli animation. This museum is a must-visit for fans and offers a unique, interactive experience with exhibits on the animation process and beloved characters. *Note: Tickets often sell out months in advance, so booking is essential.*',
//   'Links: https://www.ghibli-museum.jp/en/',
//   'Address: 1 Chome-1-83 Shimorenjaku, Mitaka, Tokyo 181-0013, Japan',
//   'Day 1 - 2025-09-16',
//   'Time: Afternoon',
//   'Place: Inokashira Park',
//   "Description: Located adjacent to the Ghibli Museum, this beautiful park offers a serene escape. Enjoy a leisurely stroll around the pond, rent a swan boat, or simply relax amidst the greenery. It's a perfect place to unwind after the museum.",
//   'Links: https://www.gotokyo.org/en/spot/898/index.html',
//   'Address: 1 Chome-18 Inokashira, Musashino, Tokyo 180-0006, Japan',
//   'Day 1 - 2025-09-16',
//   'Time: Evening',
//   'Place: Shinjuku Gyoen National Garden',
//   'Description: A surprisingly spacious and diverse garden in the heart of Shinjuku. It features three distinct styles: English Landscape, French Formal, and Japanese Traditional. The tranquil atmosphere provides a peaceful end to your day.',
//   'Links: https://www.gotokyo.org/en/spot/107/index.html',
//   'Address: 11 Naitomachi, Shinjuku City, Tokyo 160-0014, Japan',
//   'Day 2 - 2025-09-17',
//   'Time: Morning',
//   'Place: Ueno Park',
//   'Description: A large public park renowned for its museums and cultural institutions. You can choose to visit the Tokyo National Museum (for Japanese art and artifacts), the Tokyo Metropolitan Art Museum, or the National Museum of Nature and Science. The park itself is also lovely with its greenery and ponds.',
//   'Links: https://www.gotokyo.org/en/spot/64/index.html',
//   'Address: Taito City, Tokyo 110-0007, Japan',
//   'Day 2 - 2025-09-17',
//   'Time: Afternoon',
//   'Place: Nezu Museum',
//   'Description: This museum boasts a stunning Japanese garden designed by Mirei Shigemori. The museum itself houses pre-modern Japanese and East Asian art. The garden is a tranquil oasis, perfect for contemplation.',
//   'Links: https://www.nezu-museum.or.jp/en/',
//   'Address: 6 Chome-5-1 Minamiaoyama, Minato City, Tokyo 107-0062, Japan',
//   'Day 2 - 2025-09-17',
//   'Time: Evening',
//   'Place: Imperial Palace East Garden',
//   "Description: The former site of Edo Castle, now a public park surrounding the Imperial Palace. It's a spacious and historically significant area with beautiful gardens and remnants of the old castle walls. A peaceful place for a final evening stroll.",
//   'Links: https://www.sankan.kunaicho.or.jp/english/index.html',
//   'Address: 1-1 Chiyoda, Chiyoda City, Tokyo 100-8111, Japan'
// ]
