"use client";
import { useState, useEffect } from "react";
import type { Trip } from "@prisma/client";
import TripDetails from "../TripDetails";
import { useCurrentTrip } from "@/app/itinerary-dashboard/store/currentTrip";


export default function Trips() {
    // const updateFirstName = usePersonStore((state) => state.updateFirstName)
    const setTripID = useCurrentTrip((state) => state.setCurrentTripId);
    const [openTrip, setOpenTrip] = useState<number | null>(null);

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
    console.log(data)

    return (
        <>
            <div className="flex items-center justify-between mb-4 w-[95%]">
                <p className="text-lg font-semibold">My Trips</p>
                <button className="btn btn-sm btn-outline btn-primary rounded-sm">+ New Trip</button>
            </div>
            <ul className="menu text-base-content w-[90%] p-4 pl-0">
                {data && data.map((trip) => (
                    <li key={trip.id} className="mb-4 p-4 bg-white border-base-300 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="flex gap-3 bg-white flex-row justify-between w-[350px]">
                            <div className="flex flex-col gap-3">
                                <span className="font-semibold text-sm">{trip.destination}</span>
                                <span>{new Date(trip.departureDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - {new Date(trip.returnDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                            </div>

                            <div className="flex flex-row gap-2">
                                <button onClick={() => setTripID(trip.id)} className="btn btn-sm btn-outline btn-primary mt-2 rounded-sm">View</button>
                                <button className="btn btn-sm btn-outline btn-secondary mt-2 rounded-sm">Edit</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}