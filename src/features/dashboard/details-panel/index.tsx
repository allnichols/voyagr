"use client";
import { useDetailsDrawer } from "@/features/dashboard/store/detailsDrawer";
import { useCurrentActivity } from "../store/activity";
import GoogleImage from "../trips/components/google-image";
import { fetchActivity } from "./api";
import { useQuery } from "@tanstack/react-query";
import { TripActivity } from "@prisma/client";

export default function DetailsPanel() {
  const isDetailsOpen = useDetailsDrawer((state) => state.isDetailsOpen);
  const toggleDetailsDrawer = useDetailsDrawer(
    (state) => state.toggleDetailsDrawer,
  );
  const currentActivity = useCurrentActivity(
    (state) => state.currentActivity.id,
  );

  console.log(currentActivity)

  const { data: activity, isLoading, isError } = useQuery<TripActivity>({
    queryFn: () => fetchActivity(currentActivity),
    queryKey: ["tripActivity", currentActivity],
    enabled: !!currentActivity,
  });

  console.log(activity)

  return (
    <>
      {/* Drawer */}
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
          <div className="p-4 border-b border-base-300 absolute right-0 top-0">
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
            
          </figure>
          <div className="card-body">
            
            <h2 className="card-title">
              {isLoading && <div className="skeleton h-4 w-20"></div>}
              {activity?.place ? activity.place : ''}
            </h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="card-actions justify-end">
              <div className="badge badge-outline">Fashion</div>
              <div className="badge badge-outline">Products</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
