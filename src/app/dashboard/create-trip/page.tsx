import TripFrom from "@/features/dashboard/create-trip";

export default function CreateTripPage() {
  return (
    <div className="p-4">
      <h1 className="font-bold mb-4">Create a Trip</h1>

      <div className="flex justify-center ">
        <TripFrom />
      </div>
    </div>
  );
}
