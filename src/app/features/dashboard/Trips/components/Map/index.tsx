"use client";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentDay } from "@/app/features/dashboard/store/currentDay";
import ErrorBoundary from "@/app/utils/ErrorBoundry";
import { TripActivity } from "@prisma/client";
import { MapPinIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/solid";
import "leaflet/dist/leaflet.css";
import "./popup.css";

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
  const [icon, setIcon] = useState(null);
  const [position, setPosition] = useState<[number, number]>([0, 0]);

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
      if (data && data.length > 0) {
        const firstActivity = data[0];
        setPosition([firstActivity.latitude, firstActivity.longitude]);
      }
      const L = require("leaflet");
      setIcon(
        new L.Icon({
          iconUrl: `data:image/svg+xml,${svgString}`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          className: "",
        }),
      );

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        });
      }
    }
  }, [data]);

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
        {icon &&
          data &&
          data.map((activity: TripActivity) => {
            return (
              <Marker
                key={activity.id}
                icon={icon}
                position={[activity.latitude ?? 0, activity.longitude ?? 0]}
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
                          <div className="rating rating-xs rating-half">
                            {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(
                              (value, idx) => (
                                <input
                                  key={value}
                                  type="radio"
                                  name={`rating-${activity.id}`}
                                  className={`mask mask-star-2 mask-half-${idx % 2 === 0 ? 1 : 2} bg-yellow-300`}
                                  aria-label={`${value} star`}
                                  defaultChecked={activity.rating === value}
                                  disabled
                                />
                              ),
                            )}
                          </div>
                        </div>
                        <p>{
                          activity.userRatingCount ? `(${activity.userRatingCount})` : "0"
                        }</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-5 w-5 text-gray-500" />
                        <p className="text-xs text-gray-500 ml-1">
                          {activity.address}
                        </p>
                      </div>
                      {activity.nationalPhoneNumber && (
                        <div className="flex items-center gap-1">
                          <PhoneIcon className="h-5 w-5 text-gray-500" />
                          <p className="text-xs text-gray-500 ml-1">
                            {activity.nationalPhoneNumber}
                          </p>
                        </div>
                      )}
                      {activity.internationalPhoneNumber && (
                        <div className="flex items-center gap-1">
                          <PhoneIcon className="h-5 w-5 text-gray-500" />
                          <p className="text-xs text-gray-500 ml-1">
                            {activity.internationalPhoneNumber}
                          </p>
                        </div>
                      )}
                      {activity.websiteUri && (
                        <div className="flex items-center gap-1">
                          <GlobeAltIcon className="h-10 w-10 text-gray-500" />
                          <a
                            href={activity.websiteUri}
                            className="text-xs text-gray-500 ml-1"
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
