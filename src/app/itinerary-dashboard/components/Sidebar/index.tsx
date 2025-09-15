import { useEffect, useState } from "react"
import type { Trip } from "@prisma/client";

export default function Sidebar() {
    const [data, setData] = useState<Trip[] | null>(null);


    const fetchData = async () => {
        try {
            const response = await fetch('/api/getItinerary?userId=1'); // Replace with actual user ID
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);
    console.log(data);
    return (
        <div className="drawer md:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button md:hidden">
                    Open drawer
                </label>
            </div>
            <div className="drawer-side p-6 shadow-lg">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <h2 className="text-2xl font-bold mb-4">Voyagr</h2>
                <div className="divider w-[100%]"></div>
                <div>
                    <span className="text-lg font-semibold">Your Trips</span>
                </div>
                <ul className="menu text-base-content w-80 p-4 pl-0">
                    {/* Sidebar content here */}
                    {data ? (
                        data.map((trip) => {
                            return (
                                <li key={trip.id} className="mb-2">
                                    <div className="flex gap-1 shadow-md p-4 rounded-md hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold">{trip.destination}</span>
                                            <span>{new Date(trip.departureDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })} - {new Date(trip.returnDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                                            <div>
                                                {trip.preferences.split(',').map((pref, index) => (
                                                    <span key={index} className="badge badge-soft badge-secondary mr-1">{pref.trim()}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                    ) : <p>none</p>}
                </ul>
            </div>
        </div>
    )
}