"use client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentTrip } from "../../store/currentTrip";
import { Suspense } from "react";


async function fetchTripDetails(tripId: number | null) {
    if (!tripId) return Promise.resolve(null);
    return fetch(`http://localhost:3000/api/getItineraryDetails?tripId=${tripId}`).then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
}

function Details({ trip }: { trip: { id: number | null; destination: string | null } }) {
    
    const { data, error, isLoading } = useSuspenseQuery({
        queryKey: ['tripDetails', trip.id],
        queryFn: () => fetchTripDetails(trip.id),
    });

    console.log(data, error, isLoading)
    if (!data) return <div>No trip data available.</div>
    console.log(data)
    return (
        <div>
            <h2 className="font-bold text-lg mb-2">
                {`${data.length} ${data.length == 1 ? 'Day' : 'Days'} in ${trip.destination}`}
            </h2>
            <div className="divider w-full"></div>
            <div>
                {data.map((day: any, index: number) => {
                    return (
                        <div className="mb-4" key={day.dayNumber}>
                            <p className="text-sm text-gray-500">
                                Day
                            </p>
                            <p className="text-lg">
                                {`${day.dayNumber >= 10 ? '' : '0'}`}{day.dayNumber}
                            </p>
                        </div>
                        // <li key={day.dayNumber}>
                        //     <div className="timeline-middle">
                        //         <svg
                        //             xmlns="http://www.w3.org/2000/svg"
                        //             viewBox="0 0 20 20"
                        //             fill="currentColor"
                        //             className="h-5 w-5"
                        //         >
                        //             <path
                        //                 fillRule="evenodd"
                        //                 d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        //                 clipRule="evenodd"
                        //             />
                        //         </svg>
                        //     </div>
                        //     <div className="timeline-end timeline-box">
                        //         {`Day ${day.dayNumber}`} - {day.date}
                        //     </div>
                        //     <hr />
                        // </li>
                    )
                })}
            </div>
        </div>
    )
}

export default function TripDetails() {
    const selectedTrip = useCurrentTrip((state) => state.currentTrip);
    const closeTrip = useCurrentTrip((state) => state.setCurrentTripId);
    if (!selectedTrip.id) return null;

    return (
        <div className={`
            fixed top-0 left-[450px] h-full w-[350px] bg-white shadow-lg p-6 z-10
            transform transition-transform duration-300
            ${selectedTrip.id ? 'translate-x-0' : 'translate-x-[200%]'}
        `}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold mb-2">Trip Details</h3>
                <button
                    className="btn btn-sm btn-outline btn-accent"
                    onClick={() => closeTrip(null, null)}
                >
                    close
                </button>
            </div>
            <Suspense fallback={<div className="text-center py-8">Loading trip details...</div>}>
                <Details trip={selectedTrip} />
            </Suspense>
        </div>
    )
}