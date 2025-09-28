import Map from "@/app/features/dashboard/Trips/components/map";
import Itinerary from "@/app/features/dashboard/Trips/components/itinerary/itinerary";


export default function TripPage() {

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <Itinerary />

            {/* Right panel (map placeholder) */}
            <div className="flex-1 flex items-center justify-center">
                <Map />
            </div>
        </div>
    )
}