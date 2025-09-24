import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCurrentDay } from '@/app/dashboard/store/currentDay';

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

async function getTripActivities(tripDayID: number | null) {
    const url = `/api/trip-activities${tripDayID !== null ? `?tripDayId=${tripDayID}` : ''}`;
    const res = await fetch(url, { method: 'GET' });
    if(!res.ok) throw new Error('Failed to get trip activities');
    return res.json();
}

export default function Map() {
    const currentDay = useCurrentDay((state) => state.currentDay);

    const [icon, setIcon] = useState(null);
    const [position, setPosition] = useState<[number, number]>([0, 0]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['tripActivities', currentDay.id],
        queryFn: () => getTripActivities(currentDay.id),
        enabled: currentDay.id !== null,
    });

    console.log(data);

    useEffect(() => {
        if (typeof window !== "undefined") {
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
    }, []);
    return (
        <MapContainer center={[35.6768601, 139.7638947]} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "16px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* {icon && (
                <Marker icon={icon} position={[30.069830, 31.222191]}></Marker>
            )} */}
        </MapContainer>
    )
}