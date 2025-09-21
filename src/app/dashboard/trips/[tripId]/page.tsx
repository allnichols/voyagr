"use client"
import { useQuery } from "@tanstack/react-query";
import { useCurrentTrip } from "../../store/currentTrip";
import { Suspense, useState } from "react";


async function fetchTripDetails(tripId: number | null) {
    if (!tripId) return Promise.resolve(null);
    return fetch(`http://localhost:3000/api/getItineraryDetails?tripId=${tripId}`).then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
}

export default function TripPage() {

    const [daySelected, setDaySelected] = useState(1);
    const [openDays, setOpenDays] = useState<number[]>([]);
    const { data, error, isLoading } = useQuery({
        queryKey: ['tripDetails', 5],
        queryFn: () => fetchTripDetails(5),
    });

    console.log(data, error, isLoading)
    if (!data) return <div>No trip data available.</div>
    console.log(data)

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/2 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold mb-4">Details</h1>
                <div className="space-y-4">
                    {data.map((day: any) => {
                        const isOpen = openDays.includes(day.dayNumber);
                        return (
                            <div key={day.dayNumber} className="p-4 mb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Day
                                        </p>
                                        <p className="text-lg">
                                            {`${day.dayNumber >= 10 ? '' : '0'}`}{day.dayNumber}
                                        </p>
                                    </div>
                                    <button onClick={() => {
                                        setOpenDays((prev) => {
                                            return prev.includes(day.dayNumber) ? prev.filter(d => d !== day.dayNumber) : [...prev, day.dayNumber];
                                        })
                                    }}
                                        className={`btn btn-circle btn-sm btn-outline ${isOpen ? "bg-base-200" : ""}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className="ml-4 overflow-hidden transition-all duration-300"
                                    style={{
                                        maxHeight: isOpen ? `${day.activities.length * 80}px` : "0",
                                        opacity: isOpen ? 1 : 0,
                                    }}
                                >
                                    <ol className="list-decimal">
                                        {day.activities.map((activity: any) => (
                                            <li key={activity.id} className="mb-4">
                                                <p>
                                                    <span>{activity.timeOfDay}</span> - {activity.place}
                                                </p>
                                                <p>{activity.address}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Right panel (map placeholder) */}
            <div className="flex-1 bg-base-300 flex items-center justify-center">
                <div className="mockup-window border bg-base-100 w-11/12 h-5/6 flex items-center justify-center">
                    <span className="text-lg text-base-content">Map Placeholder</span>
                </div>
            </div>
        </div>
    )
}