import Itinerary from "../../../features/dashboard/trips/components/itinerary/index";
import Map from "../../../features/dashboard/trips/components/map/index";
import MapToggle from "../../../features/dashboard/trips/components/map/MapToggle";
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
