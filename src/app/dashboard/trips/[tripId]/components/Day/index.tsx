"use client";
import React, { useState } from "react";
import { deleteActivity } from "../../actions"; // Adjust the path as needed
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastMutation } from "@/app/dashboard/hooks/useToastMutation";
import { useCurrentDay } from "@/app/dashboard/store/currentDay";
import AddActivityBtn from "./AddActivityBtn";

async function getTripDayActivites(tripDayId: number | null) {
    const url = `/api/trip-activities${tripDayId !== null ? `?tripDayId=${tripDayId}` : ''}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to get trip day ativities');
    return res.json();
}

export const DayDropdown = React.memo(
    function DayDropdown({
        dayId,
        index,
        isOpen,
        onToggle
    }: {
        dayId: number,
        index: number,
        isOpen: boolean,
        onToggle: () => void
    }) {
        const setCurrentDay = useCurrentDay((state) => state.setCurrentDay);
        const currentDay = useCurrentDay((state) => state.currentDay.id);
        const [openDays, setOpenDays] = useState<number[]>([]);
        const queryClient = useQueryClient();

        const { data: activities } = useQuery({
            queryKey: ["dayActivities", dayId],
            queryFn: () => getTripDayActivites(dayId),
        });

        const deleteActivityMutation = useMutation({
            mutationFn: async (activityId: number) => {
                return await deleteActivity(activityId);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["dayActivities", dayId] });
            }
        })

        console.log(activities)

        // const isOpen = openDays.includes(day.dayNumber);

        const toast = useToastMutation(deleteActivityMutation, 3000);

        const handleDeleteActvity = (activityId: number) => {
            deleteActivityMutation.mutate(activityId);
        }

        const handleSetOpenDays = (dayNumber: number) => {
            setOpenDays((prev) => {
                return prev.includes(dayNumber)
                    ? prev.filter(d => d !== dayNumber)
                    : [...prev, dayNumber];
            })
        }

        const handleSelectDay = (currentDay: number, dayId: number) => {
            console.log('select day', dayId);
            if (currentDay !== dayId) {
                setCurrentDay(dayId);
            }
        }

        // const containerHeight = isOpen
        //     ? day.activities.length > 0
        //         ? `${day.activities.length * 200}px`
        //         : "200px"
        //     : "0";

        return (
            <>
                {toast}
                <div

                // className={`mb-6 ${day.dayNumber === 1 ? '' : 'mt-[2rem]'} cursor-pointer rounded-lg`}
                >
                    <div className="flex items-center justify-between mb-4 rounded-lg ps-2 hover:bg-base-200">
                        <div className="flex items-center gap-4 p-2">
                            <button
                                onClick={() => {
                                    handleSelectDay(currentDay as number, dayId);
                                    onToggle();
                                    // handleSetOpenDays(day.dayNumber);
                                }}
                                className={`btn btn-circle btn-sm btn-ghost`}
                            >
                                {isOpen ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                    </svg>
                                )}

                            </button>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Day
                                </p>
                                <p className="text-lg">
                                    {/* {`${day.dayNumber >= 10 ? '' : '0'}`}{day.dayNumber} */}
                                </p>
                            </div>

                        </div>
                        <div className="mr-2">
                            <div className="dropdown dropdown-top dropdown-left z-100">
                                <div tabIndex={index} role="button" className="btn btn-ghost btn-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </div>
                                <ul tabIndex={index} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xl/20">
                                    <li>
                                        <a>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Remove
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div
                        className="ml-4 mb-4 transition-all duration-300"
                        style={{
                            maxHeight: isOpen ? "500px" : "0",
                            opacity: isOpen ? 1 : 0,
                            overflow: "hidden",
                        }}
                    >

                        {/* {day.activities.map((activity: any, i: number) => (
                        <div key={activity.id} className={`flex justify-between align-bottom mb-4 rounded-lg border-2 border-base-200 p-4 opacity-0 transition-all duration-400 ${isOpen ? "block opacity-100" : "hidden"}`}>
                            <p className="text-xs font-semibold mb-1">
                                {activity.place}
                            </p>
                            <div className="dropdown dropdown-top dropdown-left  z-10">
                                <div tabIndex={i} role="button" className="btn btn-ghost btn-circle">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </div>
                                <ul tabIndex={i} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xl/20">
                                    <li className="p-2 font-semibold">
                                        <a onClick={() => handleDeleteActvity(activity.id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                            Delete
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))} */}
                        {/* <AddActivityBtn dayId={day.id} dayNumber={day.dayNumber as number} /> */}
                    </div>
                </div>
            </>
        )
    })