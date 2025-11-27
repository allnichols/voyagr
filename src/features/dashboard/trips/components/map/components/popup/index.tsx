import { TripActivity } from "@prisma/client";
import React from "react";
import dynamic from "next/dynamic";
import { MapPinIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import GoogleImage from "../../../google-image";

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function MarkerPopup({ activity }: { activity: TripActivity }) {
  return (
    <Popup>
      <div className="card items-center">
        <figure className="relative h-[175px] px-10 pt-10 w-full">
          <GoogleImage placeId={activity.gPlaceId} />
        </figure>
        <div className="card-body gap-0">
          <h2 className="card-title">
            {activity.place}
          </h2>
          <div className="flex mt-0 gap-1.5 border-b border-gray-200 pb-1">
            <div className="flex items-center gap-1">
              <p>{activity.rating}</p>
              <div className="rating rating-sm rating-half">
                {[1, 2, 3, 4, 5].map((star) => (
                  <React.Fragment key={star}>
                    <input
                      type="radio"
                      name={`rating-${activity.id}`}
                      className="mask mask-star-2 mask-half-1 bg-yellow-300 cursor-none"
                      aria-label={`${star - 0.5} star`}
                      defaultChecked={activity.rating === star - 0.5}
                      disabled
                    />
                    <input
                      type="radio"
                      name={`rating-${activity.id}`}
                      className="mask mask-star-2 mask-half-2 bg-yellow-300 cursor-none"
                      aria-label={`${star} star`}
                      defaultChecked={activity.rating === star}
                      disabled
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
            <p>
              {activity.userRatingCount ? `(${activity.userRatingCount})` : "0"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <MapPinIcon className="h-10 w-10 text-gray-500" />
            <p className="text-sm text-gray-500 m-2!">{activity.address}</p>
          </div>
          {activity.nationalPhoneNumber && (
            <div className="flex items-center gap-1">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500 m-2!">
                {activity.nationalPhoneNumber}
              </p>
            </div>
          )}
          {activity.internationalPhoneNumber && (
            <div className="flex items-center gap-1">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500 m-2!">
                {activity.internationalPhoneNumber}
              </p>
            </div>
          )}
          {activity.websiteUri && (
            <div className="flex items-center gap-1 text-ellipsis">
              <GlobeAltIcon className="h-5 w-5 text-gray-500" />
              <a
                href={activity.websiteUri}
                className="text-sm  text-gray-500 m-2! overflow-hidden text-ellipsis whitespace-nowrap max-w-48 block"
              >
                {activity.websiteUri}
              </a>
            </div>
          )}
        </div>
      </div>
    </Popup>
  );
}
