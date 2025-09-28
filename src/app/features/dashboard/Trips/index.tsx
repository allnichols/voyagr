"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentTrip } from "@/app/features/dashboard/store/currentTrip";
import { getTrips } from "./actions";
import { useQuery } from "@tanstack/react-query";
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
    const router = useRouter();

    const setTripID = useCurrentTrip((state) => state.setCurrentTripId);
    const selectedTripId = useCurrentTrip((state) => state.currentTrip.id);

    const { data } = useQuery({
        queryFn: () => getTrips(1), // Replace with actual user ID
        queryKey: ['trips'],
    })

    const handleViewTrip = (tripId: number, destination: string) => {
        setTripID(tripId, destination);

        router.push(`/dashboard/trips/${tripId}?destination=${encodeURIComponent(destination)}`);
        // Optionally, you can refetch or invalidate queries here if needed
        // queryClient.invalidateQueries({ queryKey: ['tripDetails', tripId] });
    }


    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-semibold">My Trips</p>
                <button className="btn btn-sm btn-outline btn-primary rounded-sm">+ New Trip</button>
            </div>
            {data && data.length === 0 && (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <h2 className="text-xl mb-2 font-bold">You don't have any trips!</h2>
                            <p className="mb-4">Create one now!</p>
                            <Link href="/dashboard/create-trip" className="btn btn-secondary rounded-sm">Create a trip</Link>
                        </div>
                    </div>
                )}
            <ul className="list text-base-content w-[50%] p-4 pl-0 pr-0">
                
                {data && data.map((trip) => (
                    <li key={trip.id}
                        className={
                            `mb-4 p-4 bg-white border-base-300 rounded-sm shadow-sm hover:shadow-lg transition-shadow duration-300
                            `}>
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
                                    onClick={() => handleViewTrip(trip.id, trip.destination)}
                                    className="btn btn-sm btn-primary mt-2 rounded-sm"
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