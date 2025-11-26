import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LocationIcon } from "@/components/icons/location";
import { useCurrentActivity } from "@/features/dashboard/store/activity";
import { deleteActivity } from "../../itinerary/actions";
import { useDragAndDrop } from "../../itinerary/hooks/useDragAndDrop";
import { ActivityProps } from "../activity/types";
import { TripActivity } from "@prisma/client";
import { useReorderActivity } from "../../itinerary/hooks/useItineraryMutation";
import { getTripDayActivites } from "../api/getTripDayActivities";
import GoogleImage from "../../google-image";

export default function Activities({ isOpen, dayId }: ActivityProps) {
  const queryClient = useQueryClient();
  const reorderActivityMutation = useReorderActivity();

  const setCurrentActivity = useCurrentActivity(
    (state) => state.setCurrentActivity,
  );

  const {
    data: activities,
    isLoading,
    isError,
  } = useQuery({
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

  const handleDeleteActivity = (activityId: number) => {
    deleteActivityMutation.mutate(activityId);
  };

  const activityDragAndDrop = useDragAndDrop({
    itemType: "activity",
    onReorder: (type: string, newPosition: number, activityId?: number) => {
      if (type === "activity" && activities) {
        const draggedActivity: TripActivity = activities.find(
          (activity: TripActivity) => {
            return activity.id === activityId;
          },
        );

        reorderActivityMutation.mutate({
          dayId: draggedActivity.tripDayId,
          activityId: draggedActivity.id,
          newPosition: newPosition,
        });
      }
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Sorry something went wrong</p>;
  }

  if (!activities || activities.length === 0) {
    return <p>No Activities found</p>;
  }

  return activities.map((activity: TripActivity, index: number) => {
    return (
      <div
        key={activity.id}
        draggable={true}
        className={`
                flex justify-between items-center mb-4 rounded-lg border-2 border-base-200 p-4 opacity-0 transition-all duration-400 
                cursor-grab
                ${activityDragAndDrop.isDragging(index) ? "cursor-grabbing" : ""}
                ${isOpen ? "block opacity-100" : "hidden"}
                `}
        onMouseEnter={() => setCurrentActivity(activity.id)}
        onMouseLeave={() => setCurrentActivity(null)}
        onDragStart={(e) => {
          e.stopPropagation();
          activityDragAndDrop.handleDragStart(e, index, dayId, activity.id);
        }}
        onDragOver={(e) => {
          e.stopPropagation();
          e.preventDefault();
          activityDragAndDrop.handleDragOver(e, index);
        }}
        onDragEnter={(e) => {
          e.stopPropagation();
          activityDragAndDrop.handleDragEnter;
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          activityDragAndDrop.handleDragLeave;
        }}
        onDrop={(e) => {
          e.stopPropagation();
          activityDragAndDrop.handleDrop(e, index);
        }}
      >
        <div className="flex gap-2 items-center">
          <GoogleImage placeId={activity.gPlaceId} width={45} height={45} />
          {/* {activity.iconMask ? (
                <Image
                  width={15}
                  height={15}
                  src={`${activity.iconMask}.png`}
                  alt="Place icon"
                />
              ) : (
                <LocationIcon />
              )} */}
          <p className="text-xs font-semibold mb-1">{activity.place}</p>
        </div>

        <div className="dropdown dropdown-top dropdown-left">
          <div tabIndex={index} className="btn btn-ghost btn-circle">
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
            tabIndex={index}
            className="dropdown-content menu bg-base-100 rounded-box  w-52 p-2 shadow-xl/20"
          >
            <li className="p-2 font-semibold">
              <a onClick={() => handleDeleteActivity(activity.id)}>
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
    );
  });
}
