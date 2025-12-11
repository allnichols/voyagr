import { DateRange } from "react-day-picker";

export type FormData = {
    dates: DateRange | undefined;
    destination: string;
    preferences: string[];
}

export async function createTrip(formData: FormData) {
    const res = await fetch("/api/get-ai-response", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    if(!res.ok) {
        throw new Error("Failed to create trip");
    }

    return res.json();
}