import { act } from "react";


export default function parseTextReponse(responseText: string) {
    const destinationMatch = responseText.match(/Destination:\s*(.+)/);
    let destination = destinationMatch ? destinationMatch[1].trim() : "";
    destination = destination.replace(/\*/g, ""); // Remove all asterisks
    const daysRegex = /Day\s+(\d+)\s*-\s*([\d-]+)/;
    const lines = responseText.split('\n').map(line => line.trim()).filter(Boolean);

    let day = [];
    let currentDay: any = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const dayMatch = line.match(daysRegex);

        if (dayMatch) {
            console.log('Found day match:', dayMatch);
            if (currentDay) {
                day.push(currentDay);
            }
            currentDay = {
                day: dayMatch[1],
                date: dayMatch[2].replace(/\/\\*/g, ""),
                activities: []
            };

            continue;
        }

        if(line.startsWith("Time:")) {
            const activity =  {
                time: line.replace("Time:", "").trim(),
                place: line.replace("Place:", "").trim(),
                description: line.replace("Description:", "").trim(),
                links: line.replace("Links:", "").trim().split(',').map((link) => line.trim()),
                address: line.replace("address:", "").trim(),
            }

            currentDay.activities.push(activity);
        }

    }


    if(currentDay) {
        day.push(currentDay)
    }

    return { destination, day };
}
