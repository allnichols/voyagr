"use client"
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { getTripDetails } from "./actions";
import 'leaflet/dist/leaflet.css';
import Map from "./components/Map";
import { useCurrentDay } from "../../store/currentDay";
import  ErrorBoundary from "@/app/utils/ErrorBoundry";
import { DayDropdown }from "./components/Day";
import React from "react";

async function getTripDays(tripId: number | null) {
    const url = `/api/trip-days${tripId !== null ? `?tripId=${tripId}` : ''}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to get trip days');
    return res.json();
}

export default function TripPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination');
    const tripId = params?.tripId ? Number(params.tripId) : null;

    const [openDayDropdown, setOpenDayDropdown] = React.useState<number | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['tripDays', tripId],
        queryFn: () => getTripDays(tripId),
    });


    if (!data) return <div>No trip data available.</div>

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/2 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">Trip to {destination}</h1>
                <div className="divider" />
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Itinerary</h2>
                    {data.map((day: any, idx: number) => {
                        return (
                            <DayDropdown 
                                key={day.dayNumber} 
                                dayId={day.id} 
                                dayNumber={day.dayNumber}
                                index={idx}
                                isOpen={openDayDropdown === day.id}
                                onToggle={() =>{ 
                                    setOpenDayDropdown(openDayDropdown === day.id ? null : day.id)
                                }}    
                            />
                        )
                    })}
                </div>
            </div>

            {/* Right panel (map placeholder) */}
            <div className="flex-1 flex items-center justify-center">
                <ErrorBoundary>
                    <Map />
                </ErrorBoundary>
            </div>
        </div>
    )
}