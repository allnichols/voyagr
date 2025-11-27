"use client";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCurrentDay } from "@/features/dashboard/store/currentDay";
import ErrorBoundary from "@/utils/ErrorBoundry";
import { TripActivity } from "@prisma/client";
import "leaflet/dist/leaflet.css";
import "./popup.css";
import { useCurrentActivity } from "@/features/dashboard/store/activity";
import { createMarkerIcon } from "./components/marker";
import { getTripActivities, getDestinationLatLong } from "./api";
import MarkerPopup from "./components/popup";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }, // Disable server-side rendering (Leaflet doesn't work well with SSR)
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);

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
     const markerRef = markerRefs.current[currentActivity.id];
     if(markerRef) {
      markerRef.openPopup();
     }
    }
  }, [currentActivity.id]);

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
                <MarkerPopup activity={activity} />
              </Marker>
            );
          })}
      </MapContainer>
    </ErrorBoundary>
  );
}
