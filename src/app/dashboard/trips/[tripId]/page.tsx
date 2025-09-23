"use client"
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getTripDetails } from "./actions";
import Day from "./components/Day";
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import Map from "./components/Map";

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

// const svgIcon = new L.Icon({
//     iconUrl: `data:image/svg+xml,${svgString}`,
//     iconSize: [32, 32],
//     iconAnchor: [16, 32],
//     popupAnchor: [0, -32],
//     className: "",
// });

export default function TripPage() {
    const params = useParams();
    const tripId = params?.tripId ? Number(params.tripId) : null;

    const { data, isLoading } = useQuery({
        queryKey: ['tripDetails', tripId],
        queryFn: () => getTripDetails(tripId),
    });


    if (!data) return <div>No trip data available.</div>

    return (
        <div className="flex h-screen">
            {/* Left panel */}
            <div className="w-1/2 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">Trip to {data[0].trip.destination}</h1>
                <div className="divider" />
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Itinerary</h2>
                    {data.map((day: any, i: number) => {
                        return (
                            <Day key={day.dayNumber} day={day} index={i} />
                        )
                    })}
                </div>
            </div>

            {/* Right panel (map placeholder) */}
            <div className="flex-1 flex items-center justify-center">
                <Map />
            </div>
        </div>
    )
}