"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPlace, addActivity } from "../itinerary/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentDay } from "@/features/dashboard/store/currentDay";
import Image from "next/image";
import { GooglePlace } from "@/types/google-places";
import { getPriceLevelIcons } from "./utils";
import { GooglePlaceResults } from "./components/Results";

export default function AddActivityBtn({
  dayId,
  dayNumber,
}: {
  dayId: number;
  dayNumber: number;
}) {
  const queryCleint = useQueryClient();
  const searchParams = useSearchParams();
  const currentDayId = useCurrentDay((state) => state.currentDay.id);
  const [query, setQuery] = useState("");

  const modalId = `add_activity_modal_${dayId}`;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["placeSearch", query],
    queryFn: () => fetchPlace(query, searchParams.get("destination")),
    enabled: false, // Disable automatic query on mount
  });

  const addActivityMutation = useMutation({
    mutationFn: async ({
      place,
      dayId,
    }: {
      place: GooglePlace;
      dayId: number;
    }) => {
      return await addActivity(place, dayId);
    },
    onSuccess: () => {
      queryCleint.invalidateQueries({
        queryKey: ["dayActivities", currentDayId],
      });
      // Close the modal
      (document.getElementById(modalId) as HTMLDialogElement)?.close();
    },
  });

  const handleAddActivity = (place: GooglePlace, dayId: number) => {
    addActivityMutation.mutate({ place, dayId });
  };

  const handleSearch = async (e: React.MouseEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <>
      <button
        onClick={() =>
          (document.getElementById(modalId) as HTMLDialogElement)?.showModal()
        }
        className="btn btn-neutral btn-outline rounded-2xl"
      >
        <span className="text-xl mb-1">+</span>
        Add Activity
      </button>
      <dialog id={modalId} className="modal">
        <div className="modal-box h-[550px] flex flex-col overflow-hidden">
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>

          <div className="flex items-center mb-4">
            <label className="input mt-2">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                required
                placeholder="Search"
                value={query}
                onChange={handleChange}
              />
            </label>
            <button
              type="submit"
              disabled={query.length <= 3}
              className="btn btn-primary ml-2 rounded-2xl"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex-1 flex flex-col min-h-0">
            {!data && !isLoading && (
              <p className="text-sm text-base-500">
                Enter a search term to find places to add to your itinerary.
              </p>
            )}
            {isLoading && <p>Loading...</p>}
            {data && (
              <div className="flex-1 flex flex-col min-h-0">
                <h2 className="font-bold text-lg">Results:</h2>
                {data.places.length === 0 && <p>No places found.</p>}
                <div className="mt-2 overflow-y-auto">
                  <GooglePlaceResults
                    places={data.places}
                    onSelect={(place) => handleAddActivity(place, dayId)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
