"use client";
import 'leaflet/dist/leaflet.css';
import ErrorBoundary from '@/app/utils/ErrorBoundry';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useCurrentDay } from '@/app/features/dashboard/store/currentDay';

const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }  // Disable server-side rendering (Leaflet hates SSR)
);

const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);

const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);


const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

const svgString = encodeURIComponent(`
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" fill="#2563eb" stroke="white" stroke-width="4"/>
    <text x="16" y="21" text-anchor="middle" fill="white" font-size="16" font-family="Arial" dy=".3em">📍</text>
  </svg>
`);

async function getTripActivities(tripDayID: number | null, destination: string | null = null) {
    const url = `/api/trip-activities${tripDayID !== null ? `?tripDayId=${tripDayID}` : ''}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Failed to get trip activities');
    return res.json();
}

async function getDestinationLatLong(destination: string) {
    let city = destination.split(',')[0];
    let country = destination.split(',').slice(-1)[0].trim();
    const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&country=${country}&format=json`)
    if (!res.ok) throw new Error('Failed to fetch destination coordinates');
    const data = await res.json();
    if (data.length === 0) throw new Error('No coordinates found for destination');
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

export default function Map() {
    const searchParams = useSearchParams();
    const destination = searchParams.get('destination');

    const currentDayId = useCurrentDay((state) => state.currentDay.id);
    const [icon, setIcon] = useState(null);
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['dayActivities', currentDayId],
        queryFn: () => getTripActivities(currentDayId),
        enabled: currentDayId !== null,
    });

    const { data: destinationLatLong, isLoading: loadingDestination } = useQuery({
        queryKey: ['destinationLatLong', destination],
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
                })
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
            <MapContainer center={[
                destinationLatLong?.lat ?? 0,
                destinationLatLong?.lon ?? 0
            ]} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "16px" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {icon && data && data.map((activity: any) => {
                    return (
                        <Marker key={activity.id} icon={icon} position={[activity.latitude, activity.longitude]}>
                            <Popup>
                                <div>
                                    <h3 className="font-bold">{activity.place}</h3>
                                    <button className="btn btn-xs btn-primary mt-2 rounded-2xl">View More</button>
                                </div>
                            </Popup>
                        </Marker>
                    )
                })}
            </MapContainer>
        </ErrorBoundary>

    )
}