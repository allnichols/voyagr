"use client";
import { memo } from "react";
import { deleteActivity } from "../itinerary/actions"; // Adjust the path as needed
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastMutation } from "@/app/dashboard/hooks/useToastMutation";
import { useCurrentDay } from "@/app/features/dashboard/store/currentDay";
import AddActivityBtn from "./AddActivityBtn";
import DayMenu from "./DayMenu";
import { LocationIcon } from "public/icons/location";
import Image from "next/image";

async function getTripDayActivites(tripDayId: number | null) {
  const url = `/api/trip-activities${tripDayId !== null ? `?tripDayId=${tripDayId}` : ""}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get trip day ativities");
  return res.json();
}

export const DayDropdown = memo(function DayDropdown({
  dayId,
  dayNumber,
  index,
  days,
  isOpen,
  onToggle,
  onDragStart,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  isDragging,
  isDraggingOver,
}: {
  dayId: number;
  dayNumber: number;
  index: number;
  days: { id: number; dayNumber: number; tripId: number }[];
  isOpen: boolean;
  onToggle: () => void;
  onDragStart: (
    e: React.DragEvent,
    index: number,
    dayId: number,
    dayNumber: number,
  ) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
  isDragging: (index: number) => boolean;
  isDraggingOver: (index: number) => boolean;
}) {
  const setCurrentDay = useCurrentDay((state) => state.setCurrentDay);
  const currentDay = useCurrentDay((state) => state.currentDay.id);
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
    },
  });

  const toast = useToastMutation(deleteActivityMutation, 3000);

  const handleDeleteActvity = (activityId: number) => {
    deleteActivityMutation.mutate(activityId);
  };

  const handleSelectDay = (currentDay: number, dayId: number) => {
    if (currentDay !== dayId) {
      setCurrentDay(dayId);
    }
  };

  return (
    <>
      {toast}
      <div
        draggable={isOpen ? false : true}
        id={`day-${dayId}-${index}`}
        className={`${isOpen ? "" : "cursor-grab"} ${isDragging(index) ? "opacity-50" : "opacity-100"} ${isDraggingOver(index) ? "bg-base-200" : ""}`}
        onDragStart={(e) => onDragStart(e, index, dayId, dayNumber)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, index)}
      >
        <div className="flex items-center justify-between mb-4 rounded-lg ps-2 hover:bg-base-200">
          <div className="flex items-center gap-4 p-2">
            <button
              onClick={() => {
                handleSelectDay(currentDay as number, dayId);
                onToggle();
              }}
              className={`btn btn-circle btn-sm btn-ghost`}
              type="button"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <title>Collapse</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <title>Expand</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </button>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Day</p>
                <p className="text-lg">
                  {`${dayNumber >= 10 ? "" : "0"}`}
                  {dayNumber}
                </p>
              </div>
            </div>
          </div>
          <DayMenu index={index} dayId={dayId} days={days} />
        </div>
        <div
          className="ml-4 mb-4 transition-all duration-300"
          style={{
            maxHeight: isOpen ? "500px" : "0",
            opacity: isOpen ? 1 : 0,
            display: isOpen ? "block" : "none",
          }}
        >
          {activities?.map((activity: any, i: number) => (
            <div
              key={activity.id}
              className={`flex justify-between items-center mb-4 rounded-lg border-2 border-base-200 p-4 opacity-0 transition-all duration-400 ${isOpen ? "block opacity-100" : "hidden"}`}
            >
              <div className="flex gap-2 items-center">
                {activity.iconMask ? (
                  <Image
                    width={15}
                    height={15}
                    src={`${activity.iconMask}.png`}
                    alt="Place icon"
                  />
                ) : (
                  <LocationIcon />
                )}
                <p className="text-xs font-semibold mb-1">{activity.place}</p>
              </div>

              <div className="dropdown dropdown-top dropdown-left">
                <div tabIndex={i} className="btn btn-ghost btn-circle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <title>Activity Options</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={i}
                  className="dropdown-content menu bg-base-100 rounded-box  w-52 p-2 shadow-xl/20"
                >
                  <li className="p-2 font-semibold">
                    <a onClick={() => handleDeleteActvity(activity.id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4"
                      >
                        <title>Delete Activity</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
          <AddActivityBtn dayId={dayId} dayNumber={0} />
        </div>
      </div>
    </>
  );
});
