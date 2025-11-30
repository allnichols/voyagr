"use client";
import { useDetailsDrawer } from "@/features/dashboard/store/detailsDrawer";
import { useCurrentActivity } from "../store/activity";
import GoogleImage from "../trips/components/google-image";
import { fetchActivity } from "./api";
import { useQuery } from "@tanstack/react-query";
import { TripActivity } from "@prisma/client";
import { LocationIcon } from "@/components/icons/location";
import { PhoneIcon } from "@heroicons/react/24/solid";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function DetailsPanel() {
  const isDetailsOpen = useDetailsDrawer((state) => state.isDetailsOpen);
  const toggleDetailsDrawer = useDetailsDrawer(
    (state) => state.toggleDetailsDrawer,
  );
  const currentActivity = useCurrentActivity(
    (state) => state.currentActivity.id,
  );

  console.log(currentActivity);

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

  console.log(activity);

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
        <figure className="h-[300px] w-[100%]"></figure>
        <div className="card-body">
          <h2 className="card-title text-5xl">
            {activity?.place ? activity.place : ""}
          </h2>

          <div className="flex gap-2">
            <div className="rating rating-md rating-half">
              {Array.from({ length: 11 }, (_, i) => i * 0.5).map((star) => {
                const isHidden = star === 0 ? "rating-hidden" : "";
                const isChecked = activity?.rating
                  ? star <= activity.rating
                  : false;
                const maskClass =
                  star % 1 !== 0 ? "mask-half-1" : "mask-half-2";
                const bgColor = isChecked ? "bg-yellow-500" : "";

                const className = isHidden
                  ? isHidden
                  : `mask mask-star-2 ${maskClass} ${bgColor}`;

                return (
                  <input
                    key={star}
                    type="radio"
                    name="rating-11"
                    className={className + " pointer-events-none"}
                    aria-label={`${star} star`}
                    defaultChecked={isChecked}
                    disabled
                    readOnly
                  />
                );
              })}
            </div>
            <p>({activity?.userRatingCount})</p>
          </div>
          <div className="divider" />

          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <LocationIcon />
              <div>
                <p className="font-semibold mb-2">Address</p>
                <p>{activity?.address}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <PhoneIcon width={23} height={23} />
              <div>
                <p className="font-semibold mb-2">Phone</p>
                <p>{activity?.internationalPhoneNumber}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <GlobeAltIcon width={23} height={23} />
              <div className="overflow-hidden min-w-0 flex-1">
                <p className="font-semibold mb-2">Website</p>
                <a
                  href={activity?.websiteUri ? activity?.websiteUri : ""}
                  className="block truncate"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {activity?.websiteUri}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
