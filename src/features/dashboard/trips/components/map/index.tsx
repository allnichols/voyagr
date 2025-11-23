"use client";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { act, useEffect, useRef, useState } from "react";
import { useCurrentDay } from "@/features/dashboard/store/currentDay";
import ErrorBoundary from "@/utils/ErrorBoundry";
import { TripActivity } from "@prisma/client";
import { MapPinIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import "leaflet/dist/leaflet.css";
import "./popup.css";
import React from "react";
import { useCurrentActivity } from "@/features/dashboard/store/activity";
import { createMarkerIcon } from "./components/marker";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }, // Disable server-side rendering (Leaflet hates SSR)
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const svgString = encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#422ad5" class="size-5">
    <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clip-rule="evenodd" />
</svg>
`);

async function getTripActivities(
  tripDayID: number | null,
  destination: string | null = null,
) {
  const url = `/api/trip-activities${tripDayID !== null ? `?tripDayId=${tripDayID}` : ""}`;
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Failed to get trip activities");
  return res.json();
}

async function getDestinationLatLong(destination: string) {
  let city = destination.split(",")[0];
  let country = destination.split(",").slice(-1)[0].trim();

  const usStates = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  if (usStates.includes(country)) {
    country = "USA";
  }

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`,
  );
  if (!res.ok) throw new Error("Failed to fetch destination coordinates");
  const data = await res.json();
  if (data.length === 0)
    throw new Error("No coordinates found for destination");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export default function Map() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");

  const currentDayId = useCurrentDay((state) => state.currentDay.id);
  const currentActivity = useCurrentActivity((state) => state.currentActivity);
  const [icons, setIcons] = useState<{ activeIcon: any; inactiveIcon: any }>({
    activeIcon: null,
    inactiveIcon: null,
  });
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const markerRefs = useRef<{ [key: number]: any }>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["dayActivities", currentDayId],
    queryFn: () => getTripActivities(currentDayId),
    enabled: currentDayId !== null,
  });

  const { data: destinationLatLong, isLoading: loadingDestination } = useQuery({
    queryKey: ["destinationLatLong", destination],
    queryFn: async () => getDestinationLatLong(destination!),
    enabled: !!destination,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const iconSet = createMarkerIcon();
      setIcons(iconSet);

      if (data && data.length > 0) {
        const firstActivity = data[0];
        setPosition([firstActivity.latitude, firstActivity.longitude]);
      }

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        });
      }
    }
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined" && currentActivity.id) {
      data.forEach((activity: TripActivity) => {
        const markerRef = markerRefs.current[activity.id];
        if (markerRef) {
          const isActive = currentActivity.id === activity.id;
          const newIcon = isActive ? icons.activeIcon : icons.inactiveIcon;
          markerRef.setIcon(newIcon);
        }
      });
    }
  }, [currentActivity.id, icons, data]);

  if (isLoading || loadingDestination) return <div>Loading map...</div>;
  if (error) return <div>Error loading map data.</div>;

  return (
    <ErrorBoundary>
      <MapContainer
        center={[destinationLatLong?.lat ?? 0, destinationLatLong?.lon ?? 0]}
        zoom={10}
        style={{ height: "90%", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {icons.inactiveIcon &&
          data &&
          data.map((activity: TripActivity) => {
            const isActive = currentActivity.id === activity.id;
            const icon = isActive ? icons.activeIcon : icons.inactiveIcon;
            return (
              <Marker
                key={activity.id}
                icon={icon}
                position={[activity.latitude ?? 0, activity.longitude ?? 0]}
                ref={(ref) => {
                  if (ref) {
                    markerRefs.current[activity.id] = ref;
                  }
                }}
              >
                <Popup>
                  <div className="card">
                    <div className="card-body gap-0">
                      <h2 className="text-xl ellipsis mb-[-10px]">
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
                                  defaultChecked={
                                    activity.rating === star - 0.5
                                  }
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
                          {activity.userRatingCount
                            ? `(${activity.userRatingCount})`
                            : "0"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-10 w-10 text-gray-500" />
                        <p className="text-sm text-gray-500 m-2!">
                          {activity.address}
                        </p>
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
              </Marker>
            );
          })}
      </MapContainer>
    </ErrorBoundary>
  );
}
