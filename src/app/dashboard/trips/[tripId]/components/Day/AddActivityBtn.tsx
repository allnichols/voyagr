"use client"
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPlace, addActivity } from '../../actions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentDay } from "@/app/dashboard/store/currentDay";

export default function AddActivityBtn({ dayId, dayNumber }: { dayId: number, dayNumber: number }) {
    const queryCleint = useQueryClient();
    const searchParams = useSearchParams();
    const currentDayId = useCurrentDay((state) => state.currentDay.id);
    const [query, setQuery] = useState("");

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['placeSearch', query],
        queryFn: () => fetchPlace(query, searchParams.get("destination")),
        enabled: false, // Disable automatic query on mount
    });

    const addActivityMutation = useMutation({
        mutationFn: async ({ place, dayId }: { place: string, dayId: number }) => {
            return await addActivity(place, dayId);
        },
        onSuccess: () => {
            queryCleint.invalidateQueries({ queryKey: ['dayActivities', currentDayId] });
            // Close the modal
            (document.getElementById('my_modal_3') as HTMLDialogElement)?.close();
        }
    });

    const handleAddActivity = (place: string, dayId: number) => {
        addActivityMutation.mutate({ place, dayId });
    }

    const handleSearch = async (e: React.MouseEvent) => {
        e.preventDefault();
        refetch();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    return (
        <>
            <button onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement)?.showModal()} className="btn btn-neutral btn-outline rounded-2xl">
                <span className="text-xl mb-1">+</span>
                Add Activity
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-h-[500px] flex flex-col overflow-hidden">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div>
                        <label className="input mt-2">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                                <div className="mt-2 flex-1 overflow-y-auto">
                                    {data.places.map((place: any) => {
                                        console.log('place', place.type);
                                        return (
                                            <div 
                                                key={place.id} 
                                                className="border-b border-base-300 last:border-0 p-2 cursor-pointer hover:bg-amber-500" 
                                                onClick={() => handleAddActivity(place, dayId)}
                                            >
                                                <div>{place.displayName.text}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </dialog>
        </>
    )
}