"use client"
import { useState } from "react";
import { fetchPlace } from '../../actions';
import { useQuery } from '@tanstack/react-query';

export default function AddActivityBtn({ dayNumber }: { dayNumber: number }) {

    const [query, setQuery] = useState("");

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['placeSearch', query, dayNumber],
        queryFn: () => fetchPlace(query),
        enabled: false, // Disable automatic query on mount
    });

    const handleSearch = async (e: React.MouseEvent) => {
        e.preventDefault();
        refetch();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }

    console.log('search data', data);

    return (
        <>
            <button onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement)?.showModal()} className="btn btn-neutral btn-outline rounded-2xl">
                <span className="text-xl mb-1">+</span>
                Add Activity
            </button>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
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
                    <div className="mt-4">
                        {isLoading && <p>Loading...</p>}
                        {data && (
                            <div>
                                <h2 className="font-bold text-lg">Results:</h2>
                                <p>{data.query}</p>
                                {data.places.length === 0 && <p>No places found.</p>}
                                <ul>
                                    {data.places.map((place: any) => {

                                        console.log('place', place.displayName.text);
                                        return <li key={place.id} className="border-b border-gray-200 py-2">
                                            <div className="font-semibold">{place.displayName.text}</div>
                                            {place.priceLevel && (
                                                <div className="text-sm">{place.priceLevel}</div>
                                            )}
                                        </li>
                                    })}
                                </ul>
                                {/* Render other place details as needed */}
                            </div>
                        )}
                    </div>
                </div>

            </dialog>
        </>
    )
}