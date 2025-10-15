import Itinerary from "@/app/features/dashboard/trips/components/itinerary/itinerary";
import Map from "@/app/features/dashboard/trips/components/map";
import MapToggle from "@/app/features/dashboard/trips/components/map/MapToggle";
import { MapIcon } from "@heroicons/react/24/outline";

export default function TripPage() {
  
  return (
    <div className="flex h-screen relative">
      <MapToggle />
      {/* Left panel */}
      <div className="w-full lg:w-1/2 h-full lg:h-auto relative">
        <Itinerary />
      </div>

      {/* Right panel (map placeholder) */}
      <div className="flex-1 flex items-center justify-center">
        <Map />
      </div>
    </div>
  );
}
