"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPlace, addActivity } from "../itinerary/actions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentDay } from "@/app/features/dashboard/store/currentDay";
import Image from "next/image";
import { GooglePlace } from "@/types/google-places";
import { getPriceLevelIcons } from "./utils";

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
        <div className="modal-box max-h-[500px] flex flex-col overflow-hidden">
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>

          <div>
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
            {isLoading && <p>Loading...</p>}
            {data && (
              <div className="flex-1 flex flex-col min-h-0">
                <h2 className="font-bold text-lg">Results:</h2>
                {data.places.length === 0 && <p>No places found.</p>}
                <div className="mt-2 overflow-y-auto">
                  <ul className="list">
                    {data.places.map((place: GooglePlace) => {
                      console.log("place", place);
                      return (
                        <li key={place.id} className="list-row items-center">
                          <div>
                            {place.iconMaskBaseUri ? (
                              <div className="w-4 h-4 bg-base-200">
                                <Image
                                  width={15}
                                  height={15}
                                  src={`${place.iconMaskBaseUri}.png`}
                                  alt="Place icon"
                                />
                              </div>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p>{place.displayName.text}</p>
                            <p className="text-xs text-gray-500">
                              {getPriceLevelIcons(place.priceLevel)}
                            </p>
                          </div>
                          <button
                            className="btn btn-sm btn-soft rounded-2xl"
                            onClick={() => handleAddActivity(place, dayId)}
                          >
                            Add
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
