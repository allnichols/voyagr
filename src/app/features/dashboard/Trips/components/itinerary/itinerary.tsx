"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { DayDropdown } from "@/app/features/dashboard/trips/components/day";
import { addDayToTrip } from "./actions";
import { useDragAndDrop } from "../itinerary/hooks/useDragAndDrop";
import { useReorderDay } from "./hooks/useItineraryMutation";
import { useToastMutation } from "@/app/dashboard/hooks/useToastMutation";

async function getTripDays(tripId: number | null) {
  const url = `/api/trip-days${tripId !== null ? `?tripId=${tripId}` : ""}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get trip days");
  return res.json();
}

export default function Itinerary() {
  const params = useParams();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const destination = searchParams.get("destination");
  const tripId = params?.tripId ? Number(params.tripId) : null;
  const reorderDayMutation = useReorderDay();

  const [openDayDropdown, setOpenDayDropdown] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["tripDays", tripId],
    queryFn: () => getTripDays(tripId),
  });

  const addTripDayMutation = useMutation({
    mutationFn: async (tripId: number) => {
      return await addDayToTrip(tripId, new Date());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tripDays", tripId] });
    },
  });

  const dayDragAndDrop = useDragAndDrop({
    itemType: "day",
    onReorder: (hoverIndex: number, dayId: number, type: string) => {
      if(type === 'day') {
        const draggedDay = data.find((day: any) => day.id === dayId);
        reorderDayMutation.mutate({
          tripId: tripId as number,
          dayId: draggedDay.id,
          newPosition: hoverIndex + 1,
        });
      }
    },
  });

  const toast = useToastMutation(reorderDayMutation, 3000);

  return (
    <>
      {toast}
    <div className="w-1/2 p-6 overflow-hidden">
      <h1 className="text-3xl font-bold mb-4">Trip to {destination}</h1>
      <div className="divider" />
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Itinerary</h2>

          <div>
            <button
              className="btn btn-primary rounded-sm"
              onClick={() => addTripDayMutation.mutate(tripId as number)}
            >
              Add Day
            </button>
          </div>
        </div>
        {isLoading && (
          <span className="loading loading-infinity loading-md"></span>
        )}
        <div className="overflow-y-auto max-h-[600px] pr-2">
          {data &&
            data.map((day: any, idx: number) => {
              return (     
                <DayDropdown
                  key={day.dayNumber}
                  dayId={day.id}
                  days={data}
                  dayNumber={day.dayNumber}
                  index={idx}
                  isOpen={openDayDropdown === day.id}
                  onToggle={() => {
                    setOpenDayDropdown(
                      openDayDropdown === day.id ? null : day.id,
                    );
                  }}
                  onDragStart={dayDragAndDrop.handleDragStart}
                  onDragOver={dayDragAndDrop.handleDragOver}
                  onDragEnter={dayDragAndDrop.handleDragEnter}
                  onDragLeave={dayDragAndDrop.handleDragLeave}
                  onDrop={dayDragAndDrop.handleDrop}
                  isDragging={dayDragAndDrop.isDragging}
                  isDraggingOver={dayDragAndDrop.isDragOver}
                />
              );
            })}
          {data && data.length === 0 && (
            <p>
              No days added yet. Click "Add Day" to start planning your trip!
            </p>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
