"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentTrip } from "@/app/features/dashboard/store/currentTrip";
import {  removeTrip } from "./actions";
import "./trips.css";

function getTotalDays(departureDate: Date, returnDate: Date): number {
  const start = new Date(departureDate);
  const end = new Date(returnDate);
  // Calculate difference in milliseconds, then convert to days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
}

async function getTrips() {
  const res = await fetch("/api/trips", { method: "GET" });
  if (!res.ok) throw new Error("Failed to fetch trips");
  return res.json();
}

export default function Trips() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setTripID = useCurrentTrip((state) => state.setCurrentTripId);

  const { data } = useQuery({
    queryFn: () => getTrips(), // Replace with actual user ID
    queryKey: ["trips"],
  });

  const removeTripMutation = useMutation({
    mutationFn: async (tripId: number) => {
      return await removeTrip(tripId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });

  const handleViewTrip = (tripId: number, destination: string) => {
    setTripID(tripId, destination);
    router.push(
      `/dashboard/trips/${tripId}?destination=${encodeURIComponent(destination)}`,
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-lg font-semibold">My Trips</p>
        <button
          className="btn btn-sm btn-outline btn-primary rounded-sm"
          type="button"
          onClick={() => router.push("/dashboard/create-trip")}
        >
          + New Trip
        </button>
      </div>
      {data && data.length === 0 && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl mb-2 font-bold">
              You don't have any trips!
            </h2>
            <p className="mb-4">Create one now!</p>
            <Link
              href="/dashboard/create-trip"
              className="btn btn-secondary rounded-sm"
            >
              Create a trip
            </Link>
          </div>
        </div>
      )}
      <div className="divider" />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((trip:any) => {
          return (
            <div className="card border-1 border-base-200" key={trip.id}>
              <div className="card-body">
                <h2 className="card-title">{trip.destination}</h2>
                <div>
                  <p>{`${getTotalDays(new Date(trip.departureDate), new Date(trip.returnDate))} days`}</p>
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <title>Trip Dates</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                      />
                    </svg>
                    <p>
                      {`${new Date(trip.departureDate).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })} - 
                                            ${new Date(trip.returnDate).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}`}
                    </p>
                  </div>
                </div>

                <div className="mt-4 mb-4">
                  <h3 className="text-[#717182">Preferences:</h3>
                  <div className="mt-1">
                    {trip?.preferences?.length === 0 && (
                      <span className="italic text-base-400">
                        No preferences set
                      </span>
                    )}
                    {trip?.preferences?.map((pref:string) => (
                      <span
                        key={pref}
                        className="badge badge-outline badge-secondary mr-1"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-actions justify-end">
                  <button
                    onClick={() => handleViewTrip(trip.id, trip.destination)}
                    className="btn btn-sm btn-primary rounded-sm"
                    type="button"
                  >
                    View
                  </button>
                  <button
                    onClick={() => removeTripMutation.mutate(trip.id)}
                    className="btn btn-sm btn-outline btn-accent rounded-sm"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
