import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCurrentActivity } from "@/features/dashboard/store/activity";
import { deleteActivity } from "../../itinerary/actions";
import { useDragAndDrop } from "../../itinerary/hooks/useDragAndDrop";
import { ActivityProps } from "../activity/types";
import { TripActivity } from "@prisma/client";
import { useReorderActivity } from "../../itinerary/hooks/useItineraryMutation";
import { getTripDayActivites } from "../api/getTripDayActivities";
import GoogleImage from "../../google-image";
import ActivityMenu from "./menu";

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
          <div className="relative overflow-hidden rounded w-[55px] h-[55px]">
            <GoogleImage placeId={activity.gPlaceId} />
          </div>
          <p className="text-xs font-semibold mb-1">{activity.place}</p>
        </div>

        <ActivityMenu
          activityId={activity.id}
          activityIndex={index}
          handleDeleteActivity={handleDeleteActivity}
        />
      </div>
    );
  });
}
