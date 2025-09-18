"use client";
import { useState, useEffect } from "react";
import type { Trip } from "@prisma/client";
import { useCurrentTrip } from "@/app/itinerary-dashboard/store/currentTrip";
import './trips.css';

function getTotalDays(departureDate: Date, returnDate: Date): number {
    const start = new Date(departureDate);
    const end = new Date(returnDate);
    // Calculate difference in milliseconds, then convert to days
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
}

export default function Trips() {
    const setTripID = useCurrentTrip((state) => state.setCurrentTripId);
    const selectedTripId = useCurrentTrip((state) => state.currentTrip.id);

    const [data, setData] = useState<Trip[] | null>(null);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/getItinerary?userId=1'); // Replace with actual user ID
            const result = await response.json();
            if (!Array.isArray(result)) {
                throw new Error('Invalid response format');
            }
            const trip = result.map((trip: Trip) => {
                return {
                    id: trip.id,
                    destination: trip.destination,
                    departureDate: trip.departureDate,
                    returnDate: trip.returnDate,
                    // preferences: trip.preferences,
                    // aiData: trip.aiData,
                    createdAt: trip.createdAt,
                    userId: trip.userId,
                }
            })
            setData(trip);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">My Trips</p>
                <button className="btn btn-sm btn-outline btn-primary rounded-sm">+ New Trip</button>
            </div>
            <ul className="list text-base-content w-full p-4 pl-0 pr-0">
                {data && data.map((trip) => (
                    <li key={trip.id}
                        className={
                            `mb-4 p-4 bg-white border-base-300 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300
                            trip-item ${selectedTripId === trip.id ? "selected" : ""}`}>
                        <div className="flex gap-3 bg-white flex-row justify-between ">
                            <div className="flex flex-col gap-3">
                                <span
                                    className="font-semibold text-sm"
                                >
                                    {`${getTotalDays(new Date(trip.departureDate), new Date(trip.returnDate))} days in ${trip.destination}`}
                                </span>
                                <span>
                                    {new Date(trip.departureDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} -
                                    {new Date(trip.returnDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                </span>
                            </div>

                            <div className="flex flex-row gap-2">
                                <button
                                    onClick={() => setTripID(trip.id, trip.destination)}
                                    className="btn btn-sm btn-outline btn-primary mt-2 rounded-sm"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}