"use client";
import { useDetailsDrawer } from "@/features/dashboard/store/detailsDrawer";
import { useCurrentActivity } from "../store/activity";
import { fetchActivity } from "./api";
import { useQuery } from "@tanstack/react-query";
import { TripActivity } from "@prisma/client";
import Rating from "./rating";
import Details from "./details";
import ImageCarousel from "./image-carousel";

export default function DetailsPanel() {
  const isDetailsOpen = useDetailsDrawer((state) => state.isDetailsOpen);
  const toggleDetailsDrawer = useDetailsDrawer(
    (state) => state.toggleDetailsDrawer,
  );
  const currentActivity = useCurrentActivity(
    (state) => state.currentActivity.id,
  );

  const {
    data: activity,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<TripActivity>({
    queryFn: () => fetchActivity(currentActivity),
    queryKey: ["tripActivity", currentActivity],
    enabled: !!currentActivity,
  });

  return (
    <div
      className={`
          absolute top-0 right-0 bottom-0 w-[100%] h-[99%] z-2000
          bg-white rounded-xl  
          transform transition-transform duration-300 ease-in-out overflow-y-auto 
          ${isDetailsOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{
        boxShadow: "4px 0px 18px -6px rgba(150,150,150,0.85)",
      }}
    >
      {isLoading && (
        <div>
          <div className="skeleton h-[100%] w-[100%]"></div>
        </div>
      )}

      <div className="card bg-base-100 w-[100%] h-[100%] shadow-sm relative">
        <div className="p-4 absolute right-0 top-0 z-10">
          <button
            onClick={() => toggleDetailsDrawer()}
            className="btn btn-sm ml-auto flex"
            aria-label="Close drawer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <figure className="h-[300px] w-[100%]">
          <ImageCarousel placeId={activity?.gPlaceId} />
        </figure>
        <div className="card-body">
          <h2 className="card-title text-5xl">
            {activity?.place ? activity.place : ""}
          </h2>

          {activity && <Rating activity={activity} />}

          <div className="divider" />

          {activity && <Details activity={activity} />}
        </div>
      </div>
    </div>
  );
}
