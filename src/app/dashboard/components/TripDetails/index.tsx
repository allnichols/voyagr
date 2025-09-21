"use client"
import { useSuspenseQuery } from "@tanstack/react-query";
import { useCurrentTrip } from "../../store/currentTrip";
import { Suspense, useState } from "react";


async function fetchTripDetails(tripId: number | null) {
    if (!tripId) return Promise.resolve(null);
    return fetch(`http://localhost:3000/api/getItineraryDetails?tripId=${tripId}`).then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
}

function Details({ trip }: { trip: { id: number | null; destination: string | null } }) {
    const [daySelected, setDaySelected] = useState(1);
    const { data, error, isLoading } = useSuspenseQuery({
        queryKey: ['tripDetails', trip.id],
        queryFn: () => fetchTripDetails(trip.id),
    });

    console.log(data, error, isLoading)
    if (!data) return <div>No trip data available.</div>
    console.log(data)
    return (
        <div >
            <h2 className="font-bold text-lg mb-2">
                {`${data.length} ${data.length == 1 ? 'Day' : 'Days'} in ${trip.destination}`}
            </h2>
            <div className="divider w-full"></div>
            <div className="max-h-[600px] overflow-y-auto pr-2">
                {data.map((day: any) => {
                    console.log(day)
                    return (

                        <div key={day.dayNumber} className="border-base-200 border rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Day
                                    </p>
                                    <p className="text-lg">
                                        {`${day.dayNumber >= 10 ? '' : '0'}`}{day.dayNumber}
                                    </p>
                                </div>
                                <button onClick={() => setDaySelected(day.dayNumber)} className="btn btn-circle btn-sm btn-outline">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </button>
                            </div>
                            <div className={`ml-4 ${daySelected === day.dayNumber ? 'block' : 'hidden'}`}>
                                <ol className="list-decimal">
                                    {day.activities.map((activity: any) => {
                                        return (
                                            <li  key={activity.id} className="mb-4">
                                                <p><span>{activity.timeOfDay}</span> - {activity.place} </p>
                                                <p>{activity.address}</p>
                                                <div>
                                                    <div className="flex flex-col">
                                                        <p>Helpful Links: </p>

                                                        {activity.links.map((link: string) => {
                                                            return <a key={link} href={link} className="text-blue-500 underline mr-2" target="_blank" rel="noopener noreferrer">{link}</a>
                                                        })}
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })}
                                </ol>

                            </div>
                        </div>
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
            fixed top-0 left-[450px] h-full w-[500px] bg-white shadow-lg p-6 z-10
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