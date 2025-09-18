import { useCurrentTrip } from "@/app/itinerary-dashboard/store/currentTrip";


export default function Itinerary() {

    const currentTripId = useCurrentTrip((state) => state.currentTrip.id);

    console.log("Current Trip ID:", currentTripId);


    return (
        <div className={`
                p-6 absolute top-[55px] left-[-55%] transform 
                -translate-y-1/2 text-center transition-all duration-500
               
            `}>
            <h1 className="text-3xl font-bold mb-4">Itinerary Dashboard</h1>
            <p className="text-lg">Select a trip from the sidebar to view details.</p>
        </div>
    );
}