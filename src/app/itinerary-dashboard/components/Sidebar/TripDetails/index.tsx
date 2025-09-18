"use client"
import { useQuery, useQueryClient } from "@tanstack/react-query"

type TripDetailsProps = {
    tripId: number;
    closeTrip: (tripId: number | null) => void
}

function fetchTripDetails(tripId: number) {
    return fetch(`http://localhost:3000/api/getItineraryDetails?tripId=${tripId}`).then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
}

function Details({ tripId }: { tripId: number }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['tripDetails', tripId],
        queryFn: () => fetchTripDetails(tripId),
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading trip details</div>;
    console.log(data);
    return (
        <ul className="list">
            {/* <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">01</div>
                <div><img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" /></div>
                <div className="list-col-grow">
                    <div>Dio Lupa</div>
                    <div className="text-xs uppercase font-semibold opacity-60">Remaining Reason</div>
                </div>
                <button className="btn btn-square btn-ghost">
                    <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor"><path d="M6 3L20 12 6 21 6 3z"></path></g></svg>
                </button>
            </li> */}
        </ul>
    )
}

export default function TripDetails({ tripId, closeTrip }: TripDetailsProps) {
    return (
        <div className="mt-4 p-4 bg-white border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold mb-2">Trip Details</h3>
                <button
                    className="btn btn-sm btn-outline btn-accent"
                    onClick={() => closeTrip(null)}
                >
                    close
                </button>
            </div>


            <Details tripId={tripId} />



        </div>
    )
}