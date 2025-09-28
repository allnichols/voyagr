"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { addDayToTrip } from "./actions";
import 'leaflet/dist/leaflet.css';
import Map from "@/app/features/dashboard/Trips/components/Map";
import ErrorBoundary from "@/app/utils/ErrorBoundry";
import { DayDropdown } from "../../../features/dashboard/Trips/components/Day";
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
    const queryClient = useQueryClient();
    const destination = searchParams.get('destination');
    const tripId = params?.tripId ? Number(params.tripId) : null;

    const [openDayDropdown, setOpenDayDropdown] = React.useState<number | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['tripDays', tripId],
        queryFn: () => getTripDays(tripId),
    });

    const addTripDayMutation = useMutation({
        mutationFn: async (tripId: number) => {
            return await addDayToTrip(tripId, new Date());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tripDays', tripId] });
        }
    })


    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/2 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">Trip to {destination}</h1>
                <div className="divider" />
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Itinerary</h2>

                        <div>
                            <button
                                className="btn btn-primary rounded-sm"
                                onClick={() => addTripDayMutation.mutate(tripId as number)}
                            >
                                Add Day
                            </button>
                            
                        </div>

                    </div>
                    {isLoading && <p>Loading days...</p>}
                    {data && data.map((day: any, idx: number) => {
                        return (
                            <DayDropdown
                                key={day.dayNumber}
                                dayId={day.id}
                                days={data}
                                dayNumber={day.dayNumber}
                                index={idx}
                                isOpen={openDayDropdown === day.id}
                                onToggle={() => {
                                    setOpenDayDropdown(openDayDropdown === day.id ? null : day.id)
                                }}
                            />
                        )
                    })}
                    {data && data.length === 0 && <p>No days added yet. Click "Add Day" to start planning your trip!</p>}
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