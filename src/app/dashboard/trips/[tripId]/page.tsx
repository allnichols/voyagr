"use client"
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "next/navigation";
import { getTripDetails } from "./actions";
import Day from "./components/Day";

export default function TripPage() {
    const params = useParams();
    const tripId = params?.tripId ? Number(params.tripId) : null;

    const { data, isLoading } = useQuery({
        queryKey: ['tripDetails', tripId],
        queryFn: () => getTripDetails(tripId),
    });

    if (!data) return <div>No trip data available.</div>

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/2 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">Trip to {data[0].trip.destination}</h1>
                <div className="divider" />
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Itinerary</h2>
                    {data.map((day: any, i: number) => {
                        return (
                            <Day key={day.dayNumber} day={day} index={i} />       
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